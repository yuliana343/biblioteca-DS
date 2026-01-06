package com.digitallibrary.digital_library.services.impl;
 

import com.digitallibrary.digital_library.dtos.request.ReservationRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.ReservationResponse;
import com.digitallibrary.digital_library.exceptions.BookNotAvailableException;
import com.digitallibrary.digital_library.exceptions.ResourceNotFoundException;
import com.digitallibrary.digital_library.models.Book;
import com.digitallibrary.digital_library.models.Reservation;
import com.digitallibrary.digital_library.models.User;
import com.digitallibrary.digital_library.models.enums.ReservationStatus;
import com.digitallibrary.digital_library.repositories.BookRepository;
import com.digitallibrary.digital_library.repositories.ReservationRepository;
import com.digitallibrary.digital_library.repositories.UserRepository;
import com.digitallibrary.digital_library.services.EmailService;
import com.digitallibrary.digital_library.services.ReservationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                 UserRepository userRepository,
                                 BookRepository bookRepository,
                                 EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {
        User user = userRepository.findById(reservationRequest.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", reservationRequest.getUserId()));
        
        Book book = bookRepository.findById(reservationRequest.getBookId())
            .orElseThrow(() -> new ResourceNotFoundException("Libro", reservationRequest.getBookId()));
        
        // Verificar si el usuario está activo
        if (!user.getIsActive()) {
            throw new RuntimeException("El usuario no está activo");
        }
        
        // Verificar si ya existe una reserva activa para este usuario y libro
        if (reservationRepository.existsByUserIdAndBookIdAndStatus(
                user.getId(), book.getId(), ReservationStatus.PENDING)) {
            throw new RuntimeException("Ya tiene una reserva pendiente para este libro");
        }
        
        // Verificar si el usuario ya tiene el libro prestado
        if (user.getLoans().stream().anyMatch(loan -> 
            loan.getBook().getId().equals(book.getId()) && 
            (loan.getStatus().name().equals("ACTIVE") || loan.getStatus().name().equals("OVERDUE")))) {
            throw new RuntimeException("Ya tiene un préstamo activo de este libro");
        }
        
        // Crear la reserva
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setExpiryDate(LocalDateTime.now().plusHours(48)); // 48 horas
        
        // Calcular prioridad basada en la fecha de reserva
        List<Reservation> pendingReservations = reservationRepository
            .findPendingReservationsByBookId(book.getId());
        reservation.setPriority(pendingReservations.size() + 1);
        
        reservation = reservationRepository.save(reservation);
        return convertToResponse(reservation);
    }

    @Override
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
        return convertToResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getReservationsByBook(Long bookId) {
        return reservationRepository.findByBookId(bookId, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
        
        if (reservation.getStatus() != ReservationStatus.PENDING && 
            reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new RuntimeException("Solo se pueden cancelar reservas pendientes o activas");
        }
        
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        
        // Recalcular prioridades para las reservas restantes
        recalculatePriorities(reservation.getBook().getId());
        
        return ApiResponse.success("Reserva cancelada exitosamente");
    }

    @Override
    @Transactional
    public ApiResponse confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", id));
        
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Solo se pueden confirmar reservas pendientes");
        }
        
        // Verificar que el libro esté disponible
        if (reservation.getBook().getAvailableCopies() <= 0) {
            throw new BookNotAvailableException(reservation.getBook().getId());
        }
        
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservation.setNotifiedAt(LocalDateTime.now());
        reservationRepository.save(reservation);
        
        // Notificar al usuario
        try {
            emailService.sendReservationAvailable(
                reservation.getUser().getEmail(),
                reservation.getBook().getTitle()
            );
        } catch (Exception e) {
            System.err.println("Error enviando notificación de reserva: " + e.getMessage());
        }
        
        return ApiResponse.success("Reserva confirmada exitosamente");
    }

    @Override
    @Scheduled(fixedRate = 3600000) // Cada hora
    @Transactional
    public void processExpiredReservations() {
        List<Reservation> expiredReservations = reservationRepository.findExpiredReservations();
        
        for (Reservation reservation : expiredReservations) {
            reservation.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(reservation);
        }
        
        if (!expiredReservations.isEmpty()) {
            // Recalcular prioridades para los libros afectados
            expiredReservations.stream()
                .map(reservation -> reservation.getBook().getId())
                .distinct()
                .forEach(this::recalculatePriorities);
        }
    }

    @Override
    @Scheduled(fixedRate = 1800000) // Cada 30 minutos
    @Transactional
    public void notifyAvailableReservations() {
        List<Reservation> reservationsToNotify = reservationRepository.findReservationsToNotify();
        
        for (Reservation reservation : reservationsToNotify) {
            try {
                emailService.sendReservationAvailable(
                    reservation.getUser().getEmail(),
                    reservation.getBook().getTitle()
                );
                reservation.setNotifiedAt(LocalDateTime.now());
                reservationRepository.save(reservation);
            } catch (Exception e) {
                System.err.println("Error notificando reserva " + reservation.getId() + ": " + e.getMessage());
            }
        }
    }

    @Override
    public boolean hasActiveReservation(Long userId, Long bookId) {
        return reservationRepository.existsByUserIdAndBookIdAndStatus(
            userId, bookId, ReservationStatus.PENDING) ||
               reservationRepository.existsByUserIdAndBookIdAndStatus(
            userId, bookId, ReservationStatus.ACTIVE);
    }

    @Override
    public int getReservationQueuePosition(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva", reservationId));
        
        List<Reservation> pendingReservations = reservationRepository
            .findPendingReservationsByBookId(reservation.getBook().getId());
        
        for (int i = 0; i < pendingReservations.size(); i++) {
            if (pendingReservations.get(i).getId().equals(reservationId)) {
                return i + 1;
            }
        }
        
        return 0;
    }

    private void recalculatePriorities(Long bookId) {
        List<Reservation> pendingReservations = reservationRepository
            .findPendingReservationsByBookId(bookId);
        
        for (int i = 0; i < pendingReservations.size(); i++) {
            Reservation reservation = pendingReservations.get(i);
            if (reservation.getPriority() != i + 1) {
                reservation.setPriority(i + 1);
                reservationRepository.save(reservation);
            }
        }
    }

    private ReservationResponse convertToResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setUserId(reservation.getUser().getId());
        response.setBookId(reservation.getBook().getId());
        response.setUserName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName());
        response.setBookTitle(reservation.getBook().getTitle());
        response.setReservationDate(reservation.getReservationDate());
        response.setExpiryDate(reservation.getExpiryDate());
        response.setStatus(reservation.getStatus().name());
        response.setPriority(reservation.getPriority());
        response.setNotifiedAt(reservation.getNotifiedAt());
        response.setCreatedAt(reservation.getCreatedAt());
        return response;
    }
}