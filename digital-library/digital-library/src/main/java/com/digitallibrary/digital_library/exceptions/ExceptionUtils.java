package com.digitallibrary.digital_library.exceptions;
  

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

public class ExceptionUtils {
    
    private ExceptionUtils() {
        // Clase de utilidad, no instanciable
    }
    
    public static Map<String, String> getValidationErrors(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return errors;
    }
    
    public static void throwIfErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(getValidationErrors(bindingResult));
        }
    }
    
    public static void throwIfNull(Object object, String resourceName, String identifier) {
        if (object == null) {
            throw new ResourceNotFoundException(resourceName, identifier);
        }
    }
    
    public static void throwIfExists(Object object, String resourceName, String fieldName, Object fieldValue) {
        if (object != null) {
            throw new DuplicateResourceException(resourceName, fieldName, fieldValue);
        }
    }
    
    public static void throwIfNotAvailable(boolean available, Long bookId) {
        if (!available) {
            throw new BookNotAvailableException(bookId);
        }
    }
    
    public static void throwIfLoanLimitExceeded(int currentLoans, int maxLoans, Long userId) {
        if (currentLoans >= maxLoans) {
            throw new LoanLimitExceededException(userId, currentLoans, maxLoans);
        }
    }
    
    public static void throwIfNotAllowed(boolean allowed, String operation, String resource) {
        if (!allowed) {
           throw OperationNotAllowedException.forResource("operación", "recurso");
        }
    }
}