package com.digitallibrary.digital_library.exceptions;
 

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException() {
        super();
    }
    
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s ya existe con %s: '%s'", 
            resourceName, fieldName, fieldValue));
    }
    
    public DuplicateResourceException(String resourceName, String identifier) {
        super(String.format("%s ya existe: %s", resourceName, identifier));
    }
}