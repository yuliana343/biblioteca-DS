package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.Loan;
import com.digitallibrary.digital_library.models.enums.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
 

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
     
    Page<Loan> findByUserId(Long userId, Pageable pageable);
     
    Page<Loan> findByBookId(Long bookId, Pageable pageable);
     
    Page<Loan> findByStatus(LoanStatus status, Pageable pageable);
     
    List<Loan> findByStatus(LoanStatus status);
     
    @Query("SELECT l FROM Loan l WHERE l.status = 'OVERDUE' OR (l.status = 'ACTIVE' AND l.dueDate < CURRENT_DATE)")
    List<Loan> findOverdueLoans();
     
    List<Loan> findByUserIdAndStatus(Long userId, LoanStatus status);
     
    @Query("SELECT l FROM Loan l " +
           "WHERE (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate)")
    Page<Loan> findByLoanDateBetween(@Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate,
                                    Pageable pageable);
     
    @Query("SELECT l FROM Loan l " +
           "WHERE (:status IS NULL OR l.status = :status) " +
           "AND (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate)")
    Page<Loan> searchLoans(@Param("status") LoanStatus status,
                          @Param("startDate") LocalDate startDate,
                          @Param("endDate") LocalDate endDate,
                          Pageable pageable);
     
    Long countByUserId(Long userId);
     
    Long countByUserIdAndStatus(Long userId, LoanStatus status);
     
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, LoanStatus status);
     
    @Query("SELECT l FROM Loan l " +
           "WHERE l.status = 'ACTIVE' " +
           "AND l.dueDate BETWEEN CURRENT_DATE AND :futureDate")
    List<Loan> findLoansDueSoon(@Param("futureDate") LocalDate futureDate);
     
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.status = :status")
    Long countByStatus(@Param("status") LoanStatus status);
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.loanDate >= :startDate AND l.loanDate <= :endDate")
    Long countByLoanDateBetween(@Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);
     
    @Query("SELECT FUNCTION('DATE_FORMAT', l.loanDate, '%Y-%m') as month, COUNT(l) as count " +
           "FROM Loan l " +
           "WHERE l.loanDate >= :startDate " +
           "GROUP BY FUNCTION('DATE_FORMAT', l.loanDate, '%Y-%m') " +
           "ORDER BY month")
    List<Object[]> getLoansByMonth(@Param("startDate") LocalDate startDate);
     
    @Query("SELECT l.book.id, COUNT(l) as loanCount " +
           "FROM Loan l " +
           "WHERE (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate) " +
           "GROUP BY l.book.id " +
           "ORDER BY loanCount DESC")
    List<Object[]> findMostLoanedBooks(@Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      Pageable pageable);
}
