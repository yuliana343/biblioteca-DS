package com.digitallibrary.digital_library.services.impl;
 
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthorResponse;
import com.digitallibrary.digital_library.exceptions.ResourceNotFoundException;
import com.digitallibrary.digital_library.models.Author;
import com.digitallibrary.digital_library.repositories.AuthorRepository;
import com.digitallibrary.digital_library.services.AuthorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public AuthorResponse getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Autor", id));
        return convertToResponse(author);
    }

    @Override
    public Page<AuthorResponse> getAllAuthors(String name, Pageable pageable) {
        return authorRepository.searchAuthors(name, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public List<AuthorResponse> searchAuthors(String query) {
        return authorRepository.findByNameContainingIgnoreCase(query, Pageable.unpaged())
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AuthorResponse createAuthor(AuthorResponse authorRequest) {
        Author author = new Author();
        author.setName(authorRequest.getName());
        author.setNationality(authorRequest.getNationality());
        author.setBirthDate(authorRequest.getBirthDate());
        author.setBiography(authorRequest.getBiography());
        
        author = authorRepository.save(author);
        return convertToResponse(author);
    }

    @Override
    @Transactional
    public AuthorResponse updateAuthor(Long id, AuthorResponse authorRequest) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Autor", id));
        
        author.setName(authorRequest.getName());
        author.setNationality(authorRequest.getNationality());
        author.setBirthDate(authorRequest.getBirthDate());
        author.setBiography(authorRequest.getBiography());
        
        author = authorRepository.save(author);
        return convertToResponse(author);
    }

    @Override
    @Transactional
    public ApiResponse deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Autor", id));
        
        // Verificar si el autor tiene libros asociados
        if (!author.getBooks().isEmpty()) {
            return ApiResponse.error("No se puede eliminar el autor porque tiene libros asociados");
        }
        
        authorRepository.delete(author);
        return ApiResponse.success("Autor eliminado exitosamente");
    }

    @Override
    public Map<String, Object> getAuthorWithBooks(Long id) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Autor", id));
        
        Map<String, Object> result = new HashMap<>();
        result.put("author", convertToResponse(author));
        result.put("books", author.getBooks().stream()
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
    public long countAuthors() {
        return authorRepository.count();
    }

    @Override
    public List<AuthorResponse> getPopularAuthors(int limit) {
        return authorRepository.findPopularAuthors(
                org.springframework.data.domain.PageRequest.of(0, limit))
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    private AuthorResponse convertToResponse(Author author) {
        AuthorResponse response = new AuthorResponse();
        response.setId(author.getId());
        response.setName(author.getName());
        response.setNationality(author.getNationality());
        response.setBirthDate(author.getBirthDate());
        response.setBiography(author.getBiography());
        response.setCreatedAt(author.getCreatedAt());
        response.setBookCount(author.getBooks() != null ? author.getBooks().size() : 0);
        return response;
    }
}