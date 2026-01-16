package com.digitallibrary.digital_library.dtos.response;
 

import java.time.LocalDateTime;

public class ApiResponse {
    
    private boolean success;
    private String message;
    private Object data;
    private LocalDateTime timestamp;
    private int statusCode;

    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, Object data) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success, String message, Object data, int statusCode) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
 
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
 
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message);
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(false, message);
    }

    public static ApiResponse error(String message, int statusCode) {
        ApiResponse response = new ApiResponse(false, message);
        response.setStatusCode(statusCode);
        return response;
    }
}
