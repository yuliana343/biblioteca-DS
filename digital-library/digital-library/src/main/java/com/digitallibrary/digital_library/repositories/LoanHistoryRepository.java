package com.digitallibrary.digital_library.repositories;


import com.digitallibrary.digital_library.models.LoanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanHistoryRepository extends JpaRepository<LoanHistory, Long> {
    
    // Buscar historial por usuario
    List<LoanHistory> findByUserId(Long userId);
    
    // Buscar historial por libro
    List<LoanHistory> findByBookId(Long bookId);
    
    // Calificación promedio por libro
    @Query("SELECT AVG(lh.rating) FROM LoanHistory lh WHERE lh.book.id = :bookId AND lh.rating IS NOT NULL")
    Double findAverageRatingByBookId(@Param("bookId") Long bookId);
    
    // Historial por rango de fechas
    @Query("SELECT lh FROM LoanHistory lh " +
           "WHERE lh.loanDate >= :startDate " +
           "AND lh.loanDate <= :endDate")
    List<LoanHistory> findByLoanDateBetween(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
    
    // Libros más valorados
    @Query("SELECT lh.book.id, AVG(lh.rating) as avgRating, COUNT(lh) as ratingCount " +
           "FROM LoanHistory lh " +
           "WHERE lh.rating IS NOT NULL " +
           "GROUP BY lh.book.id " +
           "HAVING COUNT(lh) >= :minRatings " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedBooks(@Param("minRatings") Integer minRatings);
    
    // Historial para recomendaciones
    @Query("SELECT lh.user.id, lh.book.id, lh.rating FROM LoanHistory lh WHERE lh.rating IS NOT NULL")
    List<Object[]> findAllRatings();
}
