package com.digitallibrary.digital_library.repositories;

import com.digitallibrary.digital_library.models.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    
    Page<Author> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    Page<Author> findByNationalityContainingIgnoreCase(String nationality, Pageable pageable);
    
    @Query("SELECT a FROM Author a " +
           "WHERE (:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Author> searchAuthors(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT a FROM Author a " +
           "LEFT JOIN a.books b " +
           "GROUP BY a.id " +
           "ORDER BY COUNT(b.id) DESC")
    Page<Author> findAuthorsWithMostBooks(Pageable pageable);
    
    // CAMBIA ESTE NOMBRE (o usa el otro en AuthorServiceImpl)
    @Query("SELECT DISTINCT a FROM Author a " +
           "JOIN a.books b " +
           "WHERE b IN (" +
           "    SELECT l.book FROM Loan l " +
           "    GROUP BY l.book " +
           "    ORDER BY COUNT(l) DESC" +
           ")")
    Page<Author> findPopularAuthors(Pageable pageable);  // CAMBIADO: findPopularAuthorsSimple -> findPopularAuthors
    
    boolean existsByName(String name);
    
    @Query("SELECT COUNT(DISTINCT a) FROM Author a")
    Long countDistinctAuthors();
    
    @Query("SELECT DISTINCT a FROM Author a " +
           "JOIN a.books b " +
           "WHERE b.availableCopies > 0")
    Page<Author> findAuthorsWithAvailableBooks(Pageable pageable);
}