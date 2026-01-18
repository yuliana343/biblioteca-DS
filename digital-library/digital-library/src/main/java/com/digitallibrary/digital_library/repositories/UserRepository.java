package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.User;
import com.digitallibrary.digital_library.models.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
     
    Optional<User> findByUsername(String username);
     
    Optional<User> findByEmail(String email);
     
    Optional<User> findByDni(String dni);
     
    Page<User> findByRole(UserRole role, Pageable pageable);
     
    Page<User> findByIsActiveTrue(Pageable pageable);
     
    Page<User> findByIsActiveFalse(Pageable pageable);
     
    @Query("SELECT u FROM User u " +
           "WHERE (:role IS NULL OR u.role = :role) " +
           "AND (:search IS NULL OR " +
           "     LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(u.dni) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsers(@Param("role") UserRole role,
                          @Param("search") String search,
                          Pageable pageable);
     
    boolean existsByUsername(String username);
     
    boolean existsByEmail(String email);
     
    boolean existsByDni(String dni);
     
    Long countByRole(UserRole role);
     
    Long countByIsActiveTrue();
     
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.loans l " +
           "WHERE l.status = 'OVERDUE'")
    List<User> findUsersWithOverdueLoans();
     
    @Query("SELECT u FROM User u " +
           "WHERE u.id IN (" +
           "    SELECT l.user.id FROM Loan l " +
           "    GROUP BY l.user.id " +
           "    ORDER BY COUNT(l.id) DESC)")
    List<User> findMostActiveUsers(Pageable pageable);
}
