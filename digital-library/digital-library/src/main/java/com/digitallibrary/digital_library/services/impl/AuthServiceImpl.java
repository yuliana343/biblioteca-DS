package com.digitallibrary.digital_library.services.impl;

import com.digitallibrary.digital_library.dtos.request.LoginRequest;
import com.digitallibrary.digital_library.dtos.request.RegisterRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthResponse;
import com.digitallibrary.digital_library.models.User;
import com.digitallibrary.digital_library.models.enums.UserRole;
import com.digitallibrary.digital_library.repositories.UserRepository;
import com.digitallibrary.digital_library.services.AuthService;
import com.digitallibrary.digital_library.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        // 1️⃣ Buscar usuario
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2️⃣ Verificar contraseña
        if (!passwordEncoder.matches(
                loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // 3️⃣ Generar JWT (SIMPLE Y FUNCIONAL)
        String token = jwtUtil.generateToken(user.getUsername());

        // 4️⃣ Respuesta
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());

        return response;
    }

    @Override
    @Transactional
    public ApiResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return ApiResponse.error("El nombre de usuario ya está en uso");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("El email ya está registrado");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(UserRole.USER);
        user.setIsActive(true);

        userRepository.save(user);

        return ApiResponse.success("Usuario registrado exitosamente");
    }

    @Override
    public ApiResponse logout(String token) {
        return ApiResponse.success("Sesión cerrada (JWT es stateless)");
    }

    @Override
    public void validateToken(String token) {
        // se validará en el filtro JWT
    }

    @Override
    public String refreshToken(String oldToken) {
        return oldToken;
    }
}
