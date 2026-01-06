package com.digitallibrary.digital_library.services;

 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    CategoryResponse getCategoryById(Long id);
    Page<CategoryResponse> getAllCategories(String name, Pageable pageable);
    List<CategoryResponse> getAllCategoriesList();
    CategoryResponse createCategory(CategoryResponse categoryRequest);
    CategoryResponse updateCategory(Long id, CategoryResponse categoryRequest);
    ApiResponse deleteCategory(Long id);
    Map<String, Object> getCategoryWithBooks(Long id);
    List<CategoryResponse> getPopularCategories(int limit);
    boolean existsByName(String name);
}