package com.digitallibrary.digital_library.controllers;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.CategoryResponse;
import com.digitallibrary.digital_library.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getAllCategories(
            Pageable pageable,
            @RequestParam(required = false) String name) {
        
        Page<CategoryResponse> categories = categoryService.getAllCategories(name, pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryResponse categoryRequest) {
        CategoryResponse category = categoryService.createCategory(categoryRequest);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id,
            @Valid @RequestBody CategoryResponse categoryRequest) {
        CategoryResponse category = categoryService.updateCategory(id, categoryRequest);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        ApiResponse response = categoryService.deleteCategory(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<?> getCategoryWithBooks(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryWithBooks(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategoriesList() {
        List<CategoryResponse> categories = categoryService.getAllCategoriesList();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/stats/popular")
    public ResponseEntity<List<CategoryResponse>> getPopularCategories(
            @RequestParam(defaultValue = "5") int limit) {
        List<CategoryResponse> categories = categoryService.getPopularCategories(limit);
        return ResponseEntity.ok(categories);
    }
}