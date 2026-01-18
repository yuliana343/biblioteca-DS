package com.digitallibrary.digital_library.services.impl;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.CategoryResponse;
import com.digitallibrary.digital_library.exceptions.DuplicateResourceException;
import com.digitallibrary.digital_library.exceptions.ResourceNotFoundException;
import com.digitallibrary.digital_library.models.Category;
import com.digitallibrary.digital_library.repositories.CategoryRepository;
import com.digitallibrary.digital_library.services.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        return convertToResponse(category);
    }

    @Override
    public Page<CategoryResponse> getAllCategories(String name, Pageable pageable) {
        return categoryRepository.searchCategories(name, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesList() {
        return categoryRepository.findAllByOrderByNameAsc()
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryResponse categoryRequest) { 
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new DuplicateResourceException("Categoría", "nombre", categoryRequest.getName());
        }
        
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryResponse categoryRequest) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
         
        if (!category.getName().equals(categoryRequest.getName()) && 
            categoryRepository.existsByName(categoryRequest.getName())) {
            throw new DuplicateResourceException("Categoría", "nombre", categoryRequest.getName());
        }
        
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        
        category = categoryRepository.save(category);
        return convertToResponse(category);
    }

    @Override
    @Transactional
    public ApiResponse deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
         
        if (!category.getBooks().isEmpty()) {
            return ApiResponse.error("No se puede eliminar la categoría porque tiene libros asociados");
        }
        
        categoryRepository.delete(category);
        return ApiResponse.success("Categoría eliminada exitosamente");
    }

    @Override
    public Map<String, Object> getCategoryWithBooks(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        
        Map<String, Object> result = new HashMap<>();
        result.put("category", convertToResponse(category));
        result.put("books", category.getBooks().stream()
            .map(book -> {
                Map<String, Object> bookInfo = new HashMap<>();
                bookInfo.put("id", book.getId());
                bookInfo.put("title", book.getTitle());
                bookInfo.put("isbn", book.getIsbn());
                bookInfo.put("availableCopies", book.getAvailableCopies());
                return bookInfo;
            })
            .collect(Collectors.toList()));
        
        return result;
    }

    @Override
    public List<CategoryResponse> getPopularCategories(int limit) {
        return categoryRepository.findPopularCategories(
                org.springframework.data.domain.PageRequest.of(0, limit))
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setCreatedAt(category.getCreatedAt());
        response.setBookCount(category.getBooks() != null ? category.getBooks().size() : 0);
         
        if (category.getBooks() != null) {
            int loanCount = category.getBooks().stream()
                .mapToInt(book -> book.getLoans() != null ? book.getLoans().size() : 0)
                .sum();
            response.setLoanCount(loanCount);
        }
        
        return response;
    }
}
