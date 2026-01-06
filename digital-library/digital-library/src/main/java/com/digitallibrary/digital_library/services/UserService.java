package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUser();
    UserResponse getUserById(Long id);
    Page<UserResponse> getAllUsers(String role, String search, Pageable pageable);
    UserResponse updateCurrentUser(UserResponse userUpdate);
    UserResponse updateUser(Long id, UserResponse userUpdate);
    ApiResponse deleteUser(Long id);
    ApiResponse toggleUserStatus(Long id);
    List<UserResponse> getUsersByRole(String role);
    long countUsers(String role);
    ApiResponse changePassword(Long userId, String oldPassword, String newPassword);
    UserResponse getUserProfile(String username);
}