package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long> {
     
    List<Statistic> findByBookId(Long bookId);
     
    Optional<Statistic> findByBookIdAndMonthYear(Long bookId, String monthYear);
     
    @Query("SELECT s.monthYear, " +
           "SUM(s.loanCount) as totalLoans, " +
           "SUM(s.reservationCount) as totalReservations, " +
           "SUM(s.viewCount) as totalViews " +
           "FROM Statistic s " +
           "WHERE s.monthYear >= :startMonth " +
           "AND s.monthYear <= :endMonth " +
           "GROUP BY s.monthYear " +
           "ORDER BY s.monthYear")
    List<Object[]> getMonthlyStats(@Param("startMonth") String startMonth,
                                  @Param("endMonth") String endMonth);
     
    @Query("UPDATE Statistic s SET s.loanCount = s.loanCount + 1 " +
           "WHERE s.book.id = :bookId AND s.monthYear = :monthYear")
    void incrementLoanCount(@Param("bookId") Long bookId, 
                          @Param("monthYear") String monthYear);
     
    @Query("UPDATE Statistic s SET s.reservationCount = s.reservationCount + 1 " +
           "WHERE s.book.id = :bookId AND s.monthYear = :monthYear")
    void incrementReservationCount(@Param("bookId") Long bookId, 
                                 @Param("monthYear") String monthYear);
     
    @Query("UPDATE Statistic s SET s.viewCount = s.viewCount + 1 " +
           "WHERE s.book.id = :bookId AND s.monthYear = :monthYear")
    void incrementViewCount(@Param("bookId") Long bookId, 
                          @Param("monthYear") String monthYear);
     
    @Query("SELECT s.book.id, SUM(s.viewCount) as totalViews " +
           "FROM Statistic s " +
           "WHERE s.monthYear >= :startMonth " +
           "AND s.monthYear <= :endMonth " +
           "GROUP BY s.book.id " +
           "ORDER BY totalViews DESC")
    List<Object[]> findMostViewedBooks(@Param("startMonth") String startMonth,
                                      @Param("endMonth") String endMonth,
                                      org.springframework.data.domain.Pageable pageable);
     
    void deleteByMonthYearBefore(String monthYear);
}
