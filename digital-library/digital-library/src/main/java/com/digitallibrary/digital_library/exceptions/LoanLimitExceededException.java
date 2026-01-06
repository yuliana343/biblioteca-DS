package com.digitallibrary.digital_library.exceptions;
 

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class LoanLimitExceededException extends RuntimeException {
    
    public LoanLimitExceededException() {
        super();
    }
    
    public LoanLimitExceededException(String message) {
        super(message);
    }
    
    public LoanLimitExceededException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public LoanLimitExceededException(Long userId, int currentLoans, int maxLoans) {
        super(String.format("El usuario con ID %d ha alcanzado el límite de préstamos. " +
            "Préstamos actuales: %d, Límite máximo: %d", 
            userId, currentLoans, maxLoans));
    }
    
    public LoanLimitExceededException(String username, int maxLoans) {
        super(String.format("El usuario '%s' ha alcanzado el límite máximo de %d préstamos", 
            username, maxLoans));
    }
    
    public LoanLimitExceededException(int maxLoans) {
        super(String.format("Ha alcanzado el límite máximo de %d préstamos activos", maxLoans));
    }
}