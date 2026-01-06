package com.digitallibrary.digital_library.controllers;
 

import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthorResponse;
import com.digitallibrary.digital_library.services.AuthorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/authors")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<Page<AuthorResponse>> getAllAuthors(
            Pageable pageable,
            @RequestParam(required = false) String name) {
        
        Page<AuthorResponse> authors = authorService.getAllAuthors(name, pageable);
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponse> getAuthorById(@PathVariable Long id) {
        AuthorResponse author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AuthorResponse>> searchAuthors(@RequestParam String query) {
        List<AuthorResponse> authors = authorService.searchAuthors(query);
        return ResponseEntity.ok(authors);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<AuthorResponse> createAuthor(@Valid @RequestBody AuthorResponse authorRequest) {
        AuthorResponse author = authorService.createAuthor(authorRequest);
        return ResponseEntity.ok(author);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<AuthorResponse> updateAuthor(@PathVariable Long id,
            @Valid @RequestBody AuthorResponse authorRequest) {
        AuthorResponse author = authorService.updateAuthor(id, authorRequest);
        return ResponseEntity.ok(author);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteAuthor(@PathVariable Long id) {
        ApiResponse response = authorService.deleteAuthor(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<?> getAuthorWithBooks(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getAuthorWithBooks(id));
    }

    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Long> countAuthors() {
        long count = authorService.countAuthors();
        return ResponseEntity.ok(count);
    }
}