package com.digitallibrary.digital_library.services.impl;

import com.digitallibrary.digital_library.dtos.request.LoanRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.LoanResponse;
import com.digitallibrary.digital_library.models.Book;
import com.digitallibrary.digital_library.models.Loan;
import com.digitallibrary.digital_library.models.User;
import com.digitallibrary.digital_library.models.enums.LoanStatus;
import com.digitallibrary.digital_library.repositories.BookRepository;
import com.digitallibrary.digital_library.repositories.LoanRepository;
import com.digitallibrary.digital_library.repositories.UserRepository;
import com.digitallibrary.digital_library.services.EmailService;
import com.digitallibrary.digital_library.services.LoanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;
    private static final int MAX_RENEWALS = 2;
    private static final int LOAN_DURATION_DAYS = 14;

    public LoanServiceImpl(LoanRepository loanRepository,
                          UserRepository userRepository,
                          BookRepository bookRepository,
                          EmailService emailService) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public LoanResponse createLoan(LoanRequest loanRequest) {
        User user = userRepository.findById(loanRequest.getUserId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Book book = bookRepository.findById(loanRequest.getBookId())
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
 
        if (!user.getIsActive()) {
            throw new RuntimeException("El usuario no está activo");
        }
 
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("El libro no está disponible");
        }
 
        if (hasOverdueLoans(user.getId())) {
            throw new RuntimeException("El usuario tiene préstamos vencidos");
        }
 
        if (getUserLoanCount(user.getId()) >= 5) {
            throw new RuntimeException("El usuario ha alcanzado el límite de préstamos");
        }
 
        if (loanRepository.existsByUserIdAndBookIdAndStatus(
                user.getId(), book.getId(), LoanStatus.ACTIVE)) {
            throw new RuntimeException("El usuario ya tiene un préstamo activo de este libro");
        }
 
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setBook(book);
        loan.setLoanDate(loanRequest.getLoanDate() != null ? 
            loanRequest.getLoanDate() : LocalDate.now());
        loan.setDueDate(loanRequest.getDueDate() != null ? 
            loanRequest.getDueDate() : LocalDate.now().plusDays(LOAN_DURATION_DAYS));
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setNotes(loanRequest.getNotes());
 
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        loan = loanRepository.save(loan);
 
        try {
            emailService.sendLoanConfirmation(
                user.getEmail(), 
                book.getTitle(), 
                loan.getDueDate()
            );
        } catch (Exception e) { 
            System.err.println("Error sending loan confirmation: " + e.getMessage());
        }

        return convertToResponse(loan);
    }

    @Override
    public LoanResponse getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
        return convertToResponse(loan);
    }

    @Override
    public List<LoanResponse> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getLoansByBook(Long bookId) {
        return loanRepository.findByBookId(bookId, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<LoanResponse> getAllLoans(String status, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LoanStatus loanStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                loanStatus = LoanStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si el estado no es válido, se ignora
            }
        }

        return loanRepository.searchLoans(loanStatus, startDate, endDate, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public List<LoanResponse> getActiveLoans() {
        return loanRepository.findByStatus(LoanStatus.ACTIVE)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getOverdueLoans() {
        return loanRepository.findOverdueLoans()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LoanResponse returnLoan(Long id) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (loan.getStatus() != LoanStatus.ACTIVE && loan.getStatus() != LoanStatus.OVERDUE) {
            throw new RuntimeException("El préstamo ya ha sido devuelto");
        }
 
        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(LocalDate.now());
 
        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
 
        if (loan.getDueDate().isBefore(LocalDate.now())) {
            long daysOverdue = ChronoUnit.DAYS.between(loan.getDueDate(), LocalDate.now());
            double fine = daysOverdue * 1.0;  
            loan.setFineAmount(fine);
        }

        loan = loanRepository.save(loan);
        return convertToResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse renewLoan(Long id) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new RuntimeException("Solo se pueden renovar préstamos activos");
        }

        if (loan.getRenewalsCount() >= MAX_RENEWALS) {
            throw new RuntimeException("No se puede renovar más veces");
        }

        if (!canRenewLoan(loan.getId())) {
            throw new RuntimeException("No se puede renovar el préstamo");
        }
 
        loan.setDueDate(loan.getDueDate().plusDays(LOAN_DURATION_DAYS));
        loan.setRenewalsCount(loan.getRenewalsCount() + 1);
        loan = loanRepository.save(loan);

        return convertToResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse updateLoanStatus(Long id, String status) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));

        try {
            LoanStatus newStatus = LoanStatus.valueOf(status.toUpperCase());
            loan.setStatus(newStatus);
             
            if (newStatus == LoanStatus.LOST) {
                Book book = loan.getBook();
                book.setTotalCopies(book.getTotalCopies() - 1);
                if (book.getAvailableCopies() > 0) {
                    book.setAvailableCopies(book.getAvailableCopies() - 1);
                }
                bookRepository.save(book);
            }

            loan = loanRepository.save(loan);
            return convertToResponse(loan);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido");
        }
    }

    @Override
    @Transactional
    public ApiResponse deleteLoan(Long id) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
 
        if (loan.getStatus() == LoanStatus.ACTIVE || loan.getStatus() == LoanStatus.OVERDUE) {
            throw new RuntimeException("No se puede eliminar un préstamo activo o vencido");
        }

        loanRepository.delete(loan);
        return ApiResponse.success("Préstamo eliminado exitosamente");
    }

    @Override
    public List<LoanResponse> getMyLoans() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return loanRepository.findByUserId(user.getId(), null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getLoanStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalLoans", loanRepository.count());
        stats.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        stats.put("overdueLoans", loanRepository.countByStatus(LoanStatus.OVERDUE));
        stats.put("returnedLoans", loanRepository.countByStatus(LoanStatus.RETURNED));
         
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = LocalDate.now().withDayOfMonth(
            LocalDate.now().lengthOfMonth());
        stats.put("loansThisMonth", loanRepository.countByLoanDateBetween(
            firstDayOfMonth, lastDayOfMonth));
        
        return stats;
    }

    @Override
    public boolean canRenewLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Préstamo no encontrado"));
 
        boolean hasReservations = !loan.getBook().getReservations().isEmpty();
         
        boolean hasFines = loan.getFineAmount() > 0;

        return loan.getRenewalsCount() < MAX_RENEWALS && 
               !hasReservations && 
               !hasFines;
    }

    @Override
    public boolean hasOverdueLoans(Long userId) {
        List<Loan> overdueLoans = loanRepository.findOverdueLoans();
        return overdueLoans.stream()
            .anyMatch(loan -> loan.getUser().getId().equals(userId));
    }

    @Override
    public int getUserLoanCount(Long userId) {
        return loanRepository.countByUserIdAndStatus(userId, LoanStatus.ACTIVE).intValue();
    }

    private LoanResponse convertToResponse(Loan loan) {
        LoanResponse response = new LoanResponse();
        response.setId(loan.getId());
        response.setUserId(loan.getUser().getId());
        response.setBookId(loan.getBook().getId());
        response.setUserName(loan.getUser().getFirstName() + " " + loan.getUser().getLastName());
        response.setBookTitle(loan.getBook().getTitle());
        response.setBookIsbn(loan.getBook().getIsbn());
        response.setLoanDate(loan.getLoanDate());
        response.setDueDate(loan.getDueDate());
        response.setReturnDate(loan.getReturnDate());
        response.setStatus(loan.getStatus().name());
        response.setRenewalsCount(loan.getRenewalsCount());
        response.setFineAmount(loan.getFineAmount());
        response.setNotes(loan.getNotes());
        response.setCreatedAt(loan.getCreatedAt());
 
        response.setCanRenew(canRenewLoan(loan.getId()));
        response.setIsOverdue(loan.getStatus() == LoanStatus.OVERDUE || 
            (loan.getStatus() == LoanStatus.ACTIVE && loan.getDueDate().isBefore(LocalDate.now())));
        
        if (response.getIsOverdue() && loan.getDueDate() != null) {
            response.setDaysOverdue((int) ChronoUnit.DAYS.between(
                loan.getDueDate(), LocalDate.now()));
        }

        return response;
    }
}
