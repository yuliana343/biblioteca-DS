package com.digitallibrary.digital_library.repositories;
  
import com.digitallibrary.digital_library.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Buscar por ISBN
    Optional<Book> findByIsbn(String isbn);
    
    // Buscar por título (contiene)
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // Buscar por autor
    @Query("SELECT DISTINCT b FROM Book b JOIN b.authors a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :authorName, '%'))")
    Page<Book> findByAuthorNameContaining(@Param("authorName") String authorName, Pageable pageable);
    
    // Buscar por categoría
    @Query("SELECT DISTINCT b FROM Book b JOIN b.categories c WHERE c.id = :categoryId")
    Page<Book> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    // Buscar por año de publicación
    Page<Book> findByPublicationYear(Integer publicationYear, Pageable pageable);
    
    // Buscar por idioma
    Page<Book> findByLanguageContainingIgnoreCase(String language, Pageable pageable);
    
    // Buscar libros disponibles
    Page<Book> findByAvailableCopiesGreaterThan(Integer minCopies, Pageable pageable);
    
    // Búsqueda avanzada
    @Query("SELECT DISTINCT b FROM Book b " +
           "LEFT JOIN b.authors a " +
           "LEFT JOIN b.categories c " +
           "WHERE (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:author IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :author, '%'))) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (:publicationYear IS NULL OR b.publicationYear = :publicationYear) " +
           "AND (:language IS NULL OR LOWER(b.language) LIKE LOWER(CONCAT('%', :language, '%')))")
    Page<Book> searchBooks(@Param("title") String title,
                          @Param("author") String author,
                          @Param("categoryId") Long categoryId,
                          @Param("publicationYear") Integer publicationYear,
                          @Param("language") String language,
                          Pageable pageable);
    
    // Búsqueda pública
    @Query("SELECT DISTINCT b FROM Book b " +
           "LEFT JOIN b.authors a " +
           "LEFT JOIN b.categories c " +
           "WHERE (:keyword IS NULL OR " +
           "       LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:category IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :category, '%'))) " +
           "AND (:author IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :author, '%')))")
    Page<Book> publicSearch(@Param("keyword") String keyword,
                           @Param("category") String category,
                           @Param("author") String author,
                           Pageable pageable);
    
    // Libros más populares por préstamos
    @Query("SELECT b FROM Book b " +
           "WHERE b.id IN (" +
           "    SELECT l.book.id FROM Loan l " +
           "    WHERE (:startDate IS NULL OR l.loanDate >= :startDate) " +
           "    AND (:endDate IS NULL OR l.loanDate <= :endDate) " +
           "    GROUP BY l.book.id " +
           "    ORDER BY COUNT(l.id) DESC)")
    List<Book> findPopularBooks(@Param("startDate") java.time.LocalDate startDate,
                               @Param("endDate") java.time.LocalDate endDate,
                               Pageable pageable);
    
    // Contar libros disponibles
    Long countByAvailableCopiesGreaterThan(Integer minCopies);
    
    // Verificar si existe por ISBN
    boolean existsByIsbn(String isbn);
    
    // Buscar libros con menos de X copias disponibles
    List<Book> findByAvailableCopiesLessThan(Integer threshold);
}