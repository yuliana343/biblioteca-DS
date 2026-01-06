package com.digitallibrary.digital_library.exceptions;
 

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.PAYMENT_REQUIRED)
public class FinePaymentRequiredException extends RuntimeException {
    
    private double amount;
    
    public FinePaymentRequiredException() {
        super();
    }
    
    public FinePaymentRequiredException(String message) {
        super(message);
    }
    
    public FinePaymentRequiredException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public FinePaymentRequiredException(double amount) {
        super(String.format("Debe pagar una multa de $%.2f para continuar", amount));
        this.amount = amount;
    }
    
    public FinePaymentRequiredException(Long userId, double amount) {
        super(String.format("El usuario con ID %d tiene una multa pendiente de $%.2f", 
            userId, amount));
        this.amount = amount;
    }
    
    public double getAmount() {
        return amount;
    }
}