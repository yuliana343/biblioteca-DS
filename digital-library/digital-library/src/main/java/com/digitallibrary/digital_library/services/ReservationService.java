package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.request.ReservationRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.ReservationResponse;

import java.util.List;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest reservationRequest);
    ReservationResponse getReservationById(Long id);
    List<ReservationResponse> getReservationsByUser(Long userId);
    List<ReservationResponse> getReservationsByBook(Long bookId);
    ApiResponse cancelReservation(Long id);
    ApiResponse confirmReservation(Long id);
    void processExpiredReservations();
    void notifyAvailableReservations();
    boolean hasActiveReservation(Long userId, Long bookId);
    int getReservationQueuePosition(Long reservationId);
}
