package com.digitallibrary.digital_library.services.impl;

import com.digitallibrary.digital_library.models.*;
import com.digitallibrary.digital_library.models.enums.*;
import com.digitallibrary.digital_library.repositories.*;
import com.digitallibrary.digital_library.services.ReportService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ReservationRepository reservationRepository;

    public ReportServiceImpl(LoanRepository loanRepository,
                            BookRepository bookRepository,
                            UserRepository userRepository,
                            CategoryRepository categoryRepository,
                            ReservationRepository reservationRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Map<String, Object> generateLoanSummaryReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
         
        report.put("totalLoans", loanRepository.count());
        report.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        report.put("overdueLoans", loanRepository.countByStatus(LoanStatus.OVERDUE));
        report.put("returnedLoans", loanRepository.countByStatus(LoanStatus.RETURNED));
         
        if (startDate != null && endDate != null) {
            long loansInPeriod = loanRepository.countByLoanDateBetween(startDate, endDate);
            report.put("loansInPeriod", loansInPeriod);
        }
         
        List<Object[]> mostLoanedBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, 10));
        report.put("mostLoanedBooks", mostLoanedBooks);
         
        List<User> mostActiveUsers = userRepository.findMostActiveUsers(PageRequest.of(0, 10));
        List<Object[]> mostActiveUsersFormatted = mostActiveUsers.stream()
            .map(user -> new Object[]{
                user.getId(), 
                user.getUsername(), 
                user.getEmail(),
                user.getLoans().size()
            })
            .collect(Collectors.toList());
        report.put("mostActiveUsers", mostActiveUsersFormatted);
        
        report.put("generatedAt", LocalDate.now());
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateMonthlyLoanReport(int year, Integer month) {
        Map<String, Object> report = new HashMap<>();
        
        LocalDate startDate;
        LocalDate endDate;
        
        if (month != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else {
            startDate = LocalDate.of(year, 1, 1);
            endDate = LocalDate.of(year, 12, 31);
        }
         
        List<Object[]> loansByMonth = loanRepository.getLoansByMonth(startDate);
        report.put("loansByMonth", loansByMonth);
         
        long totalLoans = loanRepository.countByLoanDateBetween(startDate, endDate);
        report.put("totalLoans", totalLoans);
         
        long daysInPeriod = startDate.until(endDate).getDays() + 1;
        double dailyAverage = daysInPeriod > 0 ? (double) totalLoans / daysInPeriod : 0;
        report.put("dailyAverage", String.format("%.2f", dailyAverage));
         
        List<Object[]> monthlyTopBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, 5));
        report.put("monthlyTopBooks", monthlyTopBooks);
        
        report.put("year", year);
        report.put("month", month != null ? month : "All");
        report.put("period", startDate + " to " + endDate);
        
        return report;
    }

    @Override
    public Map<String, Object> generatePopularBooksReport(int limit, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
         
        List<Object[]> mostLoanedBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, limit));
        report.put("mostLoanedBooks", mostLoanedBooks);
         
        List<Object[]> mostReservedBooks = reservationRepository.findMostReservedBooks(
            startDate != null ? startDate.atStartOfDay() : null,
            endDate != null ? endDate.atTime(23, 59, 59) : null,
            PageRequest.of(0, limit));
        report.put("mostReservedBooks", mostReservedBooks);
         
        List<Book> availablePopularBooks = bookRepository.findPopularBooks(
            startDate, endDate, PageRequest.of(0, limit));
  
List<Object[]> availablePopularBooksFormatted = availablePopularBooks.stream()
    .map(book -> new Object[]{
        book.getId(),
        book.getTitle(),
        book.getAuthors().stream()   
            .findFirst()
            .map(Author::getName)
            .orElse("Sin autor"),   
        book.getAvailableCopies()
    })
    .collect(Collectors.toList());
        report.put("availablePopularBooks", availablePopularBooksFormatted);
        
        report.put("limit", limit);
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateUserActivityReport(int limit, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
         
        List<User> mostActiveUsers = userRepository.findMostActiveUsers(PageRequest.of(0, limit));
        List<Object[]> mostActiveUsersFormatted = mostActiveUsers.stream()
            .map(user -> new Object[]{
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getLoans().size()
            })
            .collect(Collectors.toList());
        report.put("mostActiveUsers", mostActiveUsersFormatted);
         
        List<User> usersWithOverdueLoans = userRepository.findUsersWithOverdueLoans();
        List<Object[]> usersWithOverdueLoansFormatted = usersWithOverdueLoans.stream()
            .map(user -> new Object[]{
                user.getId(), 
                user.getUsername(), 
                user.getEmail(),
                user.getLoans().stream()
                    .filter(loan -> loan.getStatus() == LoanStatus.OVERDUE)
                    .count()
            })
            .collect(Collectors.toList());
        report.put("usersWithOverdueLoans", usersWithOverdueLoansFormatted);
        
        report.put("totalUsers", userRepository.count());
        report.put("activeUsers", userRepository.countByIsActiveTrue());
        report.put("limit", limit);
        
        return report;
    }

    @Override
    public Map<String, Object> generateOverdueLoansReport() {
        Map<String, Object> report = new HashMap<>();
         
        List<Loan> overdueLoans = loanRepository.findOverdueLoans();
        report.put("overdueLoans", overdueLoans.stream()
            .map(loan -> {
                Map<String, Object> loanData = new HashMap<>();
                loanData.put("id", loan.getId());
                loanData.put("user", loan.getUser().getUsername());
                loanData.put("book", loan.getBook().getTitle());
                loanData.put("dueDate", loan.getDueDate());
                loanData.put("daysOverdue", 
                    ChronoUnit.DAYS.between(loan.getDueDate(), LocalDate.now()));
                loanData.put("fine", loan.getFineAmount());
                return loanData;
            })
            .collect(Collectors.toList()));
         
        double totalFines = overdueLoans.stream()
            .mapToDouble(loan -> loan.getFineAmount() != null ? loan.getFineAmount() : 0.0)
            .sum();
        report.put("totalFines", totalFines);
         
        Map<String, Integer> usersWithMostOverdue = new HashMap<>();
        overdueLoans.forEach(loan -> {
            String username = loan.getUser().getUsername();
            usersWithMostOverdue.put(username, 
                usersWithMostOverdue.getOrDefault(username, 0) + 1);
        });
        report.put("usersWithMostOverdue", usersWithMostOverdue);
        
        report.put("totalOverdue", overdueLoans.size());
        report.put("generatedAt", LocalDate.now());
        
        return report;
    }

    @Override
    public Map<String, Object> generateCategoryUsageReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
         
        List<Object[]> categoryUsage = categoryRepository.getCategoryUsageStats(startDate, endDate);
        report.put("categoryUsage", categoryUsage);
         
        List<Category> categoriesWithMostBooks = categoryRepository.findCategoriesWithMostBooks(
            PageRequest.of(0, 10));
        List<Object[]> categoriesWithMostBooksFormatted = categoriesWithMostBooks.stream()
            .map(category -> new Object[]{
                category.getId(),
                category.getName(),
                category.getBooks().size()
            })
            .collect(Collectors.toList());
        report.put("categoriesWithMostBooks", categoriesWithMostBooksFormatted);
         
        report.put("totalCategories", categoryRepository.count());
        
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateReservationStatsReport() {
        Map<String, Object> report = new HashMap<>();
         
        List<Object[]> reservationStats = reservationRepository.getReservationStats();
        report.put("reservationStats", reservationStats);
         
        List<Reservation> activeReservations = 
            reservationRepository.findByStatus(ReservationStatus.ACTIVE, PageRequest.of(0, 100))
                .getContent();
        report.put("activeReservations", activeReservations.size());
         
        List<Reservation> pendingReservations = 
            reservationRepository.findByStatus(ReservationStatus.PENDING, PageRequest.of(0, 100))
                .getContent();
        report.put("pendingReservations", pendingReservations.size());
         
        List<Object[]> mostReservedBooks = reservationRepository.findMostReservedBooks(
            null, null, PageRequest.of(0, 10));
        report.put("mostReservedBooks", mostReservedBooks);
        
        report.put("totalReservations", reservationRepository.count());
        report.put("generatedAt", LocalDate.now());
        
        return report;
    }

    @Override
    public Map<String, Object> generateSystemHealthReport() {
        Map<String, Object> report = new HashMap<>();
         
        report.put("totalBooks", bookRepository.count());
        report.put("availableBooks", bookRepository.countByAvailableCopiesGreaterThan(0));
        report.put("totalUsers", userRepository.count());
        report.put("activeUsers", userRepository.countByIsActiveTrue());
        report.put("totalLoans", loanRepository.count());
        report.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        report.put("totalReservations", reservationRepository.count());
        report.put("totalCategories", categoryRepository.count());
         
        List<Book> lowStockBooks = bookRepository.findByAvailableCopiesLessThan(3);
        report.put("lowStockBooks", lowStockBooks.size());
         
        List<Loan> loansDueSoon = loanRepository.findLoansDueSoon(LocalDate.now().plusDays(3));
        report.put("loansDueSoon", loansDueSoon.size());
         
        List<Reservation> reservationsExpiringSoon = 
            reservationRepository.findReservationsExpiringSoon(LocalDateTime.now().plusHours(24));
        report.put("reservationsExpiringSoon", reservationsExpiringSoon.size());
        
        report.put("systemTime", LocalDateTime.now());
        report.put("databaseStatus", "Connected");
        
        return report;
    }

    @Override
    public byte[] exportLoansReport(LocalDate startDate, LocalDate endDate, String format) {
      
        String reportContent = generateLoanSummaryReport(startDate, endDate).toString();
        
        if ("pdf".equalsIgnoreCase(format)) {
            
            return reportContent.getBytes();
        } else if ("csv".equalsIgnoreCase(format)) {
           
            return reportContent.getBytes();
        } else if ("excel".equalsIgnoreCase(format)) {
          
            return reportContent.getBytes();
        }
        
        return reportContent.getBytes();
    }

    @Override
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
         
        stats.put("totalBooks", bookRepository.count());
        stats.put("availableBooks", bookRepository.countByAvailableCopiesGreaterThan(0));
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByIsActiveTrue());
        stats.put("totalLoans", loanRepository.count());
        stats.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        stats.put("overdueLoans", loanRepository.countByStatus(LoanStatus.OVERDUE));
        stats.put("totalReservations", reservationRepository.count());
         
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = LocalDate.now().withDayOfMonth(
            LocalDate.now().lengthOfMonth());
        stats.put("loansThisMonth", loanRepository.countByLoanDateBetween(
            firstDayOfMonth, lastDayOfMonth));
         
        List<Object[]> popularBooksThisMonth = loanRepository.findMostLoanedBooks(
            firstDayOfMonth, lastDayOfMonth, PageRequest.of(0, 5));
        stats.put("popularBooksThisMonth", popularBooksThisMonth);
         
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> loansByMonth = loanRepository.getLoansByMonth(sixMonthsAgo);
        stats.put("loansByMonth", loansByMonth);
         
        List<Object[]> popularCategories = categoryRepository.getCategoryUsageStats(
            sixMonthsAgo, LocalDate.now());
        stats.put("popularCategories", popularCategories);
        
        stats.put("lastUpdated", LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        return stats;
    }
}
