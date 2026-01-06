package com.digitallibrary.digital_library.controllers;

import com.digitallibrary.digital_library.dtos.request.BookRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.BookResponse;
import com.digitallibrary.digital_library.services.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            Pageable pageable,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer publicationYear,
            @RequestParam(required = false) String language) {
        
        Page<BookResponse> books = bookService.searchBooks(title, author, categoryId, 
                publicationYear, language, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        BookResponse book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookResponse> getBookByIsbn(@PathVariable String isbn) {
        BookResponse book = bookService.getBookByIsbn(isbn);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BookResponse>> getBooksByAuthor(@PathVariable Long authorId) {
        List<BookResponse> books = bookService.getBooksByAuthor(authorId);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookResponse>> getBooksByCategory(@PathVariable Long categoryId) {
        List<BookResponse> books = bookService.getBooksByCategory(categoryId);
        return ResponseEntity.ok(books);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest bookRequest) {
        BookResponse book = bookService.createBook(bookRequest);
        return ResponseEntity.ok(book);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id, 
            @Valid @RequestBody BookRequest bookRequest) {
        BookResponse book = bookService.updateBook(id, bookRequest);
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable Long id) {
        ApiResponse response = bookService.deleteBook(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    public ResponseEntity<List<BookResponse>> getAvailableBooks() {
        List<BookResponse> books = bookService.getAvailableBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/public/search")
    public ResponseEntity<Page<BookResponse>> publicSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            Pageable pageable) {
        
        Page<BookResponse> books = bookService.publicSearch(keyword, category, author, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/stats/popular")
    public ResponseEntity<List<BookResponse>> getPopularBooks(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<BookResponse> books = bookService.getPopularBooks(limit, startDate, endDate);
        return ResponseEntity.ok(books);
    }
}