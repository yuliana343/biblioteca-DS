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
    
    // Buscar por nombre de usuario
    Optional<User> findByUsername(String username);
    
    // Buscar por email
    Optional<User> findByEmail(String email);
    
    // Buscar por DNI
    Optional<User> findByDni(String dni);
    
    // Buscar por rol
    Page<User> findByRole(UserRole role, Pageable pageable);
    
    // Buscar usuarios activos
    Page<User> findByIsActiveTrue(Pageable pageable);
    
    // Buscar usuarios inactivos
    Page<User> findByIsActiveFalse(Pageable pageable);
    
    // Búsqueda por múltiples campos
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
    
    // Verificar si existe por username
    boolean existsByUsername(String username);
    
    // Verificar si existe por email
    boolean existsByEmail(String email);
    
    // Verificar si existe por DNI
    boolean existsByDni(String dni);
    
    // Contar usuarios por rol
    Long countByRole(UserRole role);
    
    // Contar usuarios activos
    Long countByIsActiveTrue();
    
    // Buscar usuarios con préstamos vencidos
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.loans l " +
           "WHERE l.status = 'OVERDUE'")
    List<User> findUsersWithOverdueLoans();
    
    // Buscar usuarios más activos
    @Query("SELECT u FROM User u " +
           "WHERE u.id IN (" +
           "    SELECT l.user.id FROM Loan l " +
           "    GROUP BY l.user.id " +
           "    ORDER BY COUNT(l.id) DESC)")
    List<User> findMostActiveUsers(Pageable pageable);
}