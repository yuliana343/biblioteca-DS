package com.digitallibrary.digital_library.repositories;

 

import com.digitallibrary.digital_library.models.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Buscar por nombre
    Optional<Category> findByName(String name);
    
    // Buscar por nombre (contiene)
    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    // Búsqueda general
    @Query("SELECT c FROM Category c " +
           "WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Category> searchCategories(@Param("name") String name, Pageable pageable);
    
    // Categorías con más libros
    @Query("SELECT c FROM Category c " +
           "LEFT JOIN c.books b " +
           "GROUP BY c.id " +
           "ORDER BY COUNT(b.id) DESC")
    List<Category> findCategoriesWithMostBooks(Pageable pageable);
    
    // Categorías populares por préstamos
@Query("SELECT DISTINCT c FROM Category c " +
       "JOIN c.books b " +
       "WHERE b IN (" +
       "    SELECT l.book FROM Loan l " +
       "    GROUP BY l.book " +
       "    ORDER BY COUNT(l) DESC" +
       ")")
List<Category> findPopularCategories(Pageable pageable);
    
    // Verificar si existe por nombre
    boolean existsByName(String name);
    
    // Contar categorías con libros
    @Query("SELECT COUNT(DISTINCT c) FROM Category c " +
           "JOIN c.books b " +
           "WHERE b.availableCopies > 0")
    Long countCategoriesWithAvailableBooks();
    
    // Estadísticas de uso por categoría
    @Query("SELECT c.name, COUNT(l.id) as loanCount " +
           "FROM Category c " +
           "JOIN c.books b " +
           "JOIN b.loans l " +
           "WHERE (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "AND (:endDate IS NULL OR l.loanDate <= :endDate) " +
           "GROUP BY c.id, c.name " +
           "ORDER BY loanCount DESC")
    List<Object[]> getCategoryUsageStats(@Param("startDate") java.time.LocalDate startDate,
                                        @Param("endDate") java.time.LocalDate endDate);
    
    // Todas las categorías ordenadas por nombre
    List<Category> findAllByOrderByNameAsc();
}