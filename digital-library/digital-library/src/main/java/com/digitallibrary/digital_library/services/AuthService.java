package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.request.LoginRequest;
import com.digitallibrary.digital_library.dtos.request.RegisterRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    ApiResponse register(RegisterRequest registerRequest);
    ApiResponse logout(String token);
    void validateToken(String token);
    String refreshToken(String oldToken);
}