package com.digitallibrary.digital_library.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class OperationNotAllowedException extends RuntimeException {
    
    public OperationNotAllowedException() {
        super();
    }
    
    public OperationNotAllowedException(String message) {
        super(message);
    }
    
    public OperationNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
     
    public static OperationNotAllowedException forResource(String operation, String resource) {
        String message = String.format("No se permite %s en %s", operation, resource);
        return new OperationNotAllowedException(message);
    }
    
    public static OperationNotAllowedException forUser(String username, String operation) {
        String message = String.format("El usuario '%s' no tiene permisos para %s", username, operation);
        return new OperationNotAllowedException(message);
    }
    
    public static OperationNotAllowedException forRole(String role, String operation) {
        String message = String.format("El rol '%s' no tiene permisos para %s", role, operation);
        return new OperationNotAllowedException(message);
    }
}
