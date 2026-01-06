package com.digitallibrary.digital_library.controllers;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.UserResponse;
import com.digitallibrary.digital_library.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        UserResponse user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        
        Page<UserResponse> users = userService.getAllUsers(role, search, pageable);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @RequestBody UserResponse userUpdate) {
        UserResponse user = userService.updateCurrentUser(userUpdate);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
            @RequestBody UserResponse userUpdate) {
        UserResponse user = userService.updateUser(id, userUpdate);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        ApiResponse response = userService.deleteUser(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long id) {
        ApiResponse response = userService.toggleUserStatus(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-role/{role}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        List<UserResponse> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Long> countUsers(@RequestParam(required = false) String role) {
        long count = userService.countUsers(role);
        return ResponseEntity.ok(count);
    }
}