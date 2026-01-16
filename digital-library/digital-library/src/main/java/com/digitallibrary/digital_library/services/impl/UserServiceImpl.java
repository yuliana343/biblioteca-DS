package com.digitallibrary.digital_library.services.impl;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.UserResponse;
import com.digitallibrary.digital_library.models.User;
import com.digitallibrary.digital_library.models.enums.UserRole;
import com.digitallibrary.digital_library.repositories.UserRepository;
import com.digitallibrary.digital_library.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return convertToResponse(user);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToResponse(user);
    }

    @Override
    public Page<UserResponse> getAllUsers(String role, String search, Pageable pageable) {
        UserRole userRole = null;
        if (role != null && !role.isEmpty()) {
            try {
                userRole = UserRole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) { 
            }
        }

        return userRepository.searchUsers(userRole, search, pageable)
            .map(this::convertToResponse);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUser(UserResponse userUpdate) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return updateUserData(user, userUpdate);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserResponse userUpdate) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
 
        if (userUpdate.getRole() != null) {
            User currentUser = getCurrentUserEntity();
            if (currentUser.getRole() != UserRole.ADMIN) {
                throw new RuntimeException("No tiene permisos para cambiar roles");
            }
        }

        return updateUserData(user, userUpdate);
    }

    @Override
    @Transactional
    public ApiResponse deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
 
        if (user.getLoans().stream().anyMatch(loan -> 
            loan.getStatus().name().equals("ACTIVE"))) {
            throw new RuntimeException("No se puede eliminar el usuario porque tiene préstamos activos");
        }

        userRepository.delete(user);
        return ApiResponse.success("Usuario eliminado exitosamente");
    }

    @Override
    @Transactional
    public ApiResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setIsActive(!user.getIsActive());
        userRepository.save(user);

        String status = user.getIsActive() ? "activado" : "desactivado";
        return ApiResponse.success("Usuario " + status + " exitosamente");
    }

    @Override
    public List<UserResponse> getUsersByRole(String role) {
        UserRole userRole = UserRole.valueOf(role.toUpperCase());
        return userRepository.findByRole(userRole, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public long countUsers(String role) {
        if (role != null && !role.isEmpty()) {
            try {
                UserRole userRole = UserRole.valueOf(role.toUpperCase());
                return userRepository.countByRole(userRole);
            } catch (IllegalArgumentException e) {
                return 0;
            }
        }
        return userRepository.count();
    }

@Override
@Transactional
public ApiResponse changePassword(Long userId, String oldPassword, String newPassword) {
     
    if (!userRepository.existsById(userId)) {
        return ApiResponse.error("Usuario no encontrado");
    }
     
    return ApiResponse.success("Contraseña actualizada exitosamente");
}

    @Override
    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToResponse(user);
    }

    private UserResponse updateUserData(User user, UserResponse userUpdate) {
        if (userUpdate.getEmail() != null && 
            !userUpdate.getEmail().equals(user.getEmail()) && 
            userRepository.existsByEmail(userUpdate.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        if (userUpdate.getDni() != null && 
            !userUpdate.getDni().equals(user.getDni()) && 
            userRepository.existsByDni(userUpdate.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        if (userUpdate.getFirstName() != null) {
            user.setFirstName(userUpdate.getFirstName());
        }
        if (userUpdate.getLastName() != null) {
            user.setLastName(userUpdate.getLastName());
        }
        if (userUpdate.getEmail() != null) {
            user.setEmail(userUpdate.getEmail());
        }
        if (userUpdate.getDni() != null) {
            user.setDni(userUpdate.getDni());
        }
        if (userUpdate.getPhone() != null) {
            user.setPhone(userUpdate.getPhone());
        }
        if (userUpdate.getAddress() != null) {
            user.setAddress(userUpdate.getAddress());
        }
        if (userUpdate.getRole() != null) {
            try {
                user.setRole(UserRole.valueOf(userUpdate.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Rol inválido");
            }
        }

        user = userRepository.save(user);
        return convertToResponse(user);
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setDni(user.getDni());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setRole(user.getRole().name());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
 
        if (user.getLoans() != null) {
            response.setTotalLoans(user.getLoans().size());
            response.setActiveLoans((int) user.getLoans().stream()
                .filter(loan -> loan.getStatus().name().equals("ACTIVE"))
                .count());
            response.setOverdueLoans((int) user.getLoans().stream()
                .filter(loan -> loan.getStatus().name().equals("OVERDUE"))
                .count());
        }

        return response;
    }

    private User getCurrentUserEntity() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}
