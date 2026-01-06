package com.digitallibrary.digital_library.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // Cambié a CONFLICT para coincidir con tu handler
public class ReservationNotAllowedException extends RuntimeException {
    
    public ReservationNotAllowedException() {
        super();
    }
    
    public ReservationNotAllowedException(String message) {
        super(message);
    }
    
    public ReservationNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
    
    // Métodos factory estáticos para diferentes casos de reserva
    public static ReservationNotAllowedException bookNotAvailable(Long bookId) {
        String message = String.format("El libro con ID %d no está disponible para reserva", bookId);
        return new ReservationNotAllowedException(message);
    }
    
    public static ReservationNotAllowedException userHasActiveReservation(String username, Long bookId) {
        String message = String.format("El usuario '%s' ya tiene una reserva activa para el libro con ID %d", username, bookId);
        return new ReservationNotAllowedException(message);
    }
    
    public static ReservationNotAllowedException maxReservationsReached(String username, int maxLimit) {
        String message = String.format("El usuario '%s' ha alcanzado el límite máximo de %d reservas activas", username, maxLimit);
        return new ReservationNotAllowedException(message);
    }
    
    public static ReservationNotAllowedException reservationPeriodNotStarted() {
        return new ReservationNotAllowedException("El período de reserva aún no ha comenzado");
    }
    
    public static ReservationNotAllowedException reservationPeriodEnded() {
        return new ReservationNotAllowedException("El período de reserva ha finalizado");
    }
}