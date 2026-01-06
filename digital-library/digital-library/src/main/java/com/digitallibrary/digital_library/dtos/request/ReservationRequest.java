package com.digitallibrary.digital_library.dtos.request;
 

import jakarta.validation.constraints.NotNull;

public class ReservationRequest {
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;
    
    @NotNull(message = "El ID del libro es obligatorio")
    private Long bookId;

    // Getters y Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}