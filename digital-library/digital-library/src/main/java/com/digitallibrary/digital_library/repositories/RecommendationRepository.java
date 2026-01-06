package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    // Buscar recomendaciones por usuario
    List<Recommendation> findByUserId(Long userId);
    
    // Buscar recomendaciones por usuario ordenadas por score
    List<Recommendation> findByUserIdOrderByScoreDesc(Long userId);
    
    // Verificar si existe recomendación para usuario y libro
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    
    // Eliminar recomendaciones antiguas por usuario
    void deleteByUserId(Long userId);
    
    // Recomendaciones recientes
    @Query("SELECT r FROM Recommendation r " +
           "WHERE r.user.id = :userId " +
           "AND r.createdAt >= :sinceDate " +
           "ORDER BY r.score DESC")
    List<Recommendation> findRecentByUserId(@Param("userId") Long userId, 
                                           @Param("sinceDate") java.time.LocalDateTime sinceDate);
}