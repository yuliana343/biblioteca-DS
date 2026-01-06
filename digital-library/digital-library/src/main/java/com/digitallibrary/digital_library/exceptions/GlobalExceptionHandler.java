package com.digitallibrary.digital_library.exceptions;

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<ApiResponse> handleBookNotAvailableException(
            BookNotAvailableException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.CONFLICT.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(LoanLimitExceededException.class)
    public ResponseEntity<ApiResponse> handleLoanLimitExceededException(
            LoanLimitExceededException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage("Credenciales inválidas. Verifique su usuario y contraseña.");
        response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse> handleUsernameNotFoundException(
            UsernameNotFoundException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage("Usuario no encontrado");
        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage("No tiene permisos para realizar esta acción");
        response.setStatusCode(HttpStatus.FORBIDDEN.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage("Error de validación");
        response.setData(errors);
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        // Log the exception for debugging
        ex.printStackTrace();
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage("Error interno del servidor. Por favor, intente más tarde.");
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.CONFLICT.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse> handleValidationException(
            ValidationException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setData(ex.getErrors());
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OperationNotAllowedException.class)
    public ResponseEntity<ApiResponse> handleOperationNotAllowedException(
            OperationNotAllowedException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.FORBIDDEN.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ReservationNotAllowedException.class)
    public ResponseEntity<ApiResponse> handleReservationNotAllowedException(
            ReservationNotAllowedException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.CONFLICT.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(RenewalNotAllowedException.class)
    public ResponseEntity<ApiResponse> handleRenewalNotAllowedException(
            RenewalNotAllowedException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FinePaymentRequiredException.class)
    public ResponseEntity<ApiResponse> handleFinePaymentRequiredException(
            FinePaymentRequiredException ex, WebRequest request) {
        
        ApiResponse response = new ApiResponse();
        response.setSuccess(false);
        response.setMessage(ex.getMessage());
        response.setStatusCode(HttpStatus.PAYMENT_REQUIRED.value());
        response.setTimestamp(LocalDateTime.now());
        
        return new ResponseEntity<>(response, HttpStatus.PAYMENT_REQUIRED);
    }
}