package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.request.BookRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface BookService {
    BookResponse createBook(BookRequest bookRequest);
    BookResponse updateBook(Long id, BookRequest bookRequest);
    ApiResponse deleteBook(Long id);
    BookResponse getBookById(Long id);
    BookResponse getBookByIsbn(String isbn);
    Page<BookResponse> getAllBooks(Pageable pageable);
    Page<BookResponse> searchBooks(String title, String author, Long categoryId, 
                                  Integer publicationYear, String language, Pageable pageable);
    List<BookResponse> getBooksByAuthor(Long authorId);
    List<BookResponse> getBooksByCategory(Long categoryId);
    List<BookResponse> getAvailableBooks();
    Page<BookResponse> publicSearch(String keyword, String category, String author, Pageable pageable);
    List<BookResponse> getPopularBooks(int limit, LocalDate startDate, LocalDate endDate);
    ApiResponse updateBookCopies(Long bookId, Integer copies);
    boolean isBookAvailable(Long bookId);
}