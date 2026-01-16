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
     
    List<LoanHistory> findByUserId(Long userId);
     
    List<LoanHistory> findByBookId(Long bookId);
     
    @Query("SELECT AVG(lh.rating) FROM LoanHistory lh WHERE lh.book.id = :bookId AND lh.rating IS NOT NULL")
    Double findAverageRatingByBookId(@Param("bookId") Long bookId);
     
    @Query("SELECT lh FROM LoanHistory lh " +
           "WHERE lh.loanDate >= :startDate " +
           "AND lh.loanDate <= :endDate")
    List<LoanHistory> findByLoanDateBetween(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
     
    @Query("SELECT lh.book.id, AVG(lh.rating) as avgRating, COUNT(lh) as ratingCount " +
           "FROM LoanHistory lh " +
           "WHERE lh.rating IS NOT NULL " +
           "GROUP BY lh.book.id " +
           "HAVING COUNT(lh) >= :minRatings " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedBooks(@Param("minRatings") Integer minRatings);
     
    @Query("SELECT lh.user.id, lh.book.id, lh.rating FROM LoanHistory lh WHERE lh.rating IS NOT NULL")
    List<Object[]> findAllRatings();
}
