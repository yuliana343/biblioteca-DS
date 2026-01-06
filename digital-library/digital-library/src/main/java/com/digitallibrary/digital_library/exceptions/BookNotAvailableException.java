package com.digitallibrary.digital_library.exceptions;
 

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class BookNotAvailableException extends RuntimeException {
    
    public BookNotAvailableException() {
        super();
    }
    
    public BookNotAvailableException(String message) {
        super(message);
    }
    
    public BookNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public BookNotAvailableException(Long bookId) {
        super(String.format("El libro con ID %d no está disponible actualmente", bookId));
    }
    
    public BookNotAvailableException(String isbn, String title) {
        super(String.format("El libro '%s' (ISBN: %s) no está disponible", title, isbn));
    }
    
    public BookNotAvailableException(String isbn, int availableCopies) {
        super(String.format("Solo quedan %d copias disponibles del libro con ISBN: %s", 
            availableCopies, isbn));
    }
}