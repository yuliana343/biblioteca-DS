package com.digitallibrary.digital_library.repositories;
 

import com.digitallibrary.digital_library.models.Notification;
import com.digitallibrary.digital_library.models.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Buscar por usuario
    Page<Notification> findByUserId(Long userId, Pageable pageable);
    
    // Buscar por tipo
    Page<Notification> findByType(NotificationType type, Pageable pageable);
    
    // Buscar notificaciones no leídas por usuario
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
    
    // Contar notificaciones no leídas por usuario
    Long countByUserIdAndIsReadFalse(Long userId);
    
    // Notificaciones recientes por usuario
    @Query("SELECT n FROM Notification n " +
           "WHERE n.user.id = :userId " +
           "ORDER BY n.sentAt DESC")
    List<Notification> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Notificaciones por rango de fechas
    @Query("SELECT n FROM Notification n " +
           "WHERE n.sentAt >= :startDate " +
           "AND n.sentAt <= :endDate")
    List<Notification> findBySentAtBetween(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    // Marcar todas como leídas para un usuario
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
    
    // Eliminar notificaciones antiguas
    void deleteBySentAtBefore(LocalDateTime date);
}