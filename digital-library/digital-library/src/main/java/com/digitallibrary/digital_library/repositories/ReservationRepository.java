package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.Reservation;
import com.digitallibrary.digital_library.models.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
     
    Page<Reservation> findByUserId(Long userId, Pageable pageable);
     
    Page<Reservation> findByBookId(Long bookId, Pageable pageable);
     
    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);
     
    List<Reservation> findByUserIdAndStatus(Long userId, ReservationStatus status);
     
    List<Reservation> findByBookIdAndStatus(Long bookId, ReservationStatus status);
     
    Optional<Reservation> findByUserIdAndBookIdAndStatus(Long userId, Long bookId, ReservationStatus status);
     
    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' AND r.expiryDate < CURRENT_TIMESTAMP")
    List<Reservation> findExpiredReservations();
     
    @Query("SELECT r FROM Reservation r " +
           "WHERE r.status = 'PENDING' " +
           "AND r.expiryDate BETWEEN CURRENT_TIMESTAMP AND :futureDate")
    List<Reservation> findReservationsExpiringSoon(@Param("futureDate") LocalDateTime futureDate);
     
    @Query("SELECT r FROM Reservation r " +
           "WHERE r.status = 'PENDING' " +
           "AND r.book.id = :bookId " +
           "ORDER BY r.priority DESC, r.reservationDate ASC")
    List<Reservation> findPendingReservationsByBookId(@Param("bookId") Long bookId);
     
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, ReservationStatus status);
     
    Long countByUserId(Long userId);
     
    Long countByUserIdAndStatus(Long userId, ReservationStatus status);
     
    Long countByStatus(ReservationStatus status);
     
    @Query("SELECT r.status, COUNT(r) as count FROM Reservation r GROUP BY r.status")
    List<Object[]> getReservationStats();
     
    @Query("SELECT r FROM Reservation r " +
           "WHERE (:startDate IS NULL OR r.reservationDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.reservationDate <= :endDate)")
    Page<Reservation> findByReservationDateBetween(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate,
                                                  Pageable pageable);
     
    @Query("SELECT r FROM Reservation r " +
           "JOIN r.book b " +
           "WHERE r.status = 'PENDING' " +
           "AND b.availableCopies > 0 " +
           "AND (r.notifiedAt IS NULL OR r.notifiedAt < r.reservationDate)")
    List<Reservation> findReservationsToNotify();
     
    @Query("SELECT r.book.id, COUNT(r) as reservationCount " +
           "FROM Reservation r " +
           "WHERE (:startDate IS NULL OR r.reservationDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.reservationDate <= :endDate) " +
           "GROUP BY r.book.id " +
           "ORDER BY reservationCount DESC")
    List<Object[]> findMostReservedBooks(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate,
                                        Pageable pageable);
}
