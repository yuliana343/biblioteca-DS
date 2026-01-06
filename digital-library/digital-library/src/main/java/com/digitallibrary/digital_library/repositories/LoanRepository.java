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
    
    // Buscar por usuario
    Page<Loan> findByUserId(Long userId, Pageable pageable);
    
    // Buscar por libro
    Page<Loan> findByBookId(Long bookId, Pageable pageable);
    
    // Buscar por estado
    Page<Loan> findByStatus(LoanStatus status, Pageable pageable);
    
    // Buscar préstamos activos
    List<Loan> findByStatus(LoanStatus status);
    
    // Buscar préstamos vencidos
    @Query("SELECT l FROM Loan l WHERE l.status = 'OVERDUE' OR (l.status = 'ACTIVE' AND l.dueDate < CURRENT_DATE)")
    List<Loan> findOverdueLoans();
    
    // Buscar préstamos activos por usuario
    List<Loan> findByUserIdAndStatus(Long userId, LoanStatus status);
    
    // Buscar préstamos por rango de fechas
    @Query("SELECT l FROM Loan l " +
           "WHERE (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate)")
    Page<Loan> findByLoanDateBetween(@Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate,
                                    Pageable pageable);
    
    // Búsqueda avanzada
    @Query("SELECT l FROM Loan l " +
           "WHERE (:status IS NULL OR l.status = :status) " +
           "AND (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate)")
    Page<Loan> searchLoans(@Param("status") LoanStatus status,
                          @Param("startDate") LocalDate startDate,
                          @Param("endDate") LocalDate endDate,
                          Pageable pageable);
    
    // Contar préstamos por usuario
    Long countByUserId(Long userId);
    
    // Contar préstamos activos por usuario
    Long countByUserIdAndStatus(Long userId, LoanStatus status);
    
    // Verificar si existe préstamo activo para usuario y libro
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, LoanStatus status);
    
    // Préstamos próximos a vencer (en los próximos 3 días)
    @Query("SELECT l FROM Loan l " +
           "WHERE l.status = 'ACTIVE' " +
           "AND l.dueDate BETWEEN CURRENT_DATE AND :futureDate")
    List<Loan> findLoansDueSoon(@Param("futureDate") LocalDate futureDate);
    
    // Estadísticas de préstamos
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.status = :status")
    Long countByStatus(@Param("status") LoanStatus status);
    
    @Query("SELECT COUNT(l) FROM Loan l WHERE l.loanDate >= :startDate AND l.loanDate <= :endDate")
    Long countByLoanDateBetween(@Param("startDate") LocalDate startDate,
                               @Param("endDate") LocalDate endDate);
    
    // Historial de préstamos por mes
    @Query("SELECT FUNCTION('DATE_FORMAT', l.loanDate, '%Y-%m') as month, COUNT(l) as count " +
           "FROM Loan l " +
           "WHERE l.loanDate >= :startDate " +
           "GROUP BY FUNCTION('DATE_FORMAT', l.loanDate, '%Y-%m') " +
           "ORDER BY month")
    List<Object[]> getLoansByMonth(@Param("startDate") LocalDate startDate);
    
    // Libros más prestados
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
