package com.digitallibrary.digital_library.services.impl;

import com.digitallibrary.digital_library.dtos.response.BookResponse;
import com.digitallibrary.digital_library.models.Book;
import com.digitallibrary.digital_library.models.Category;
import com.digitallibrary.digital_library.repositories.BookRepository;
import com.digitallibrary.digital_library.repositories.LoanHistoryRepository;
import com.digitallibrary.digital_library.repositories.LoanRepository;
import com.digitallibrary.digital_library.services.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final BookRepository bookRepository;
    private final LoanHistoryRepository loanHistoryRepository;

    public RecommendationServiceImpl(BookRepository bookRepository,
                                    LoanHistoryRepository loanHistoryRepository,
                                    LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.loanHistoryRepository = loanHistoryRepository;
       
    }

    @Override
    public List<BookResponse> getRecommendationsForUser(Long userId) { 
        List<Long> userBookIds = loanHistoryRepository.findByUserId(userId)
            .stream()
            .map(loanHistory -> loanHistory.getBook().getId())
            .distinct()
            .collect(Collectors.toList());
         
        if (userBookIds.isEmpty()) {
            return getPopularRecommendations();
        }
         
        return getSimilarBooks(userBookIds);
    }

    private List<BookResponse> getSimilarBooks(List<Long> bookIds) {
     
        List<Book> userBooks = bookRepository.findAllById(bookIds);
         
        Set<Category> userCategories = userBooks.stream()
            .flatMap(book -> book.getCategories().stream())
            .collect(Collectors.toSet());
         
        return bookRepository.findAll().stream()
            .filter(book -> !bookIds.contains(book.getId()))
            .filter(book -> book.getCategories().stream()
                .anyMatch(userCategories::contains))
            .limit(5)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getPopularRecommendations() {
        return bookRepository.findPopularBooks(null, null,
                org.springframework.data.domain.PageRequest.of(0, 10))
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getSimilarBooks(Long bookId) {
        Optional<Book> optionalBook = bookRepository.findById(bookId);
        
        if (optionalBook.isEmpty()) {
            return Collections.emptyList();
        }
        
        Book book = optionalBook.get();
        Set<Category> categories = book.getCategories();
         
        if (categories.isEmpty()) {
            return getPopularRecommendations().stream()
                .limit(5)
                .collect(Collectors.toList());
        }
         
        Set<Long> categoryIds = categories.stream()
            .map(Category::getId)
            .collect(Collectors.toSet());
         
        return bookRepository.findAll().stream()
            .filter(b -> !b.getId().equals(bookId))
            .filter(b -> b.getCategories().stream()
                .anyMatch(cat -> categoryIds.contains(cat.getId())))
            .limit(5)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getNewArrivals() {
        return bookRepository.findAll()
            .stream()
            .filter(book -> book.getCreatedAt() != null && 
                book.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
            .limit(10)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public void generateRecommendationsForUser(Long userId) {
        System.out.println("Generando recomendaciones para usuario: " + userId);
    }

    @Override
    public void updateRecommendations() {
        System.out.println("Actualizando recomendaciones del sistema");
    }

    @Override
    public void clearUserRecommendations(Long userId) {
        System.out.println("Limpiando recomendaciones del usuario: " + userId);
    }

    private BookResponse convertToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setIsbn(book.getIsbn());
        response.setAvailableCopies(book.getAvailableCopies());
      
        return response;
    }
}
