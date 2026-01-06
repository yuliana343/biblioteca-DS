package com.digitallibrary.digital_library.exceptions;
 
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException() {
        super();
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s : '%s'", 
            resourceName, fieldName, fieldValue));
    }
    
    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s no encontrado con ID: %d", resourceName, id));
    }
    
    public ResourceNotFoundException(String resourceName, String identifier) {
        super(String.format("%s no encontrado: %s", resourceName, identifier));
    }
}