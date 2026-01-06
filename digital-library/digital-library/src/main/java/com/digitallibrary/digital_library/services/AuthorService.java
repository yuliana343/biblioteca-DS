package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface AuthorService {
    AuthorResponse getAuthorById(Long id);
    Page<AuthorResponse> getAllAuthors(String name, Pageable pageable);
    List<AuthorResponse> searchAuthors(String query);
    AuthorResponse createAuthor(AuthorResponse authorRequest);
    AuthorResponse updateAuthor(Long id, AuthorResponse authorRequest);
    ApiResponse deleteAuthor(Long id);
    Map<String, Object> getAuthorWithBooks(Long id);
    long countAuthors();
    List<AuthorResponse> getPopularAuthors(int limit);
}