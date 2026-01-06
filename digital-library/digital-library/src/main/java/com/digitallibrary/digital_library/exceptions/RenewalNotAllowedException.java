package com.digitallibrary.digital_library.exceptions;
 

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class RenewalNotAllowedException extends RuntimeException {
    
    public RenewalNotAllowedException() {
        super();
    }
    
    public RenewalNotAllowedException(String message) {
        super(message);
    }
    
    public RenewalNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public RenewalNotAllowedException(Long loanId, String reason) {
        super(String.format("No se puede renovar el préstamo con ID %d: %s", loanId, reason));
    }
    
    public RenewalNotAllowedException(int maxRenewals) {
        super(String.format("No se puede renovar más de %d veces", maxRenewals));
    }
}
