package com.digitallibrary.digital_library.services.impl;
 

import com.digitallibrary.digital_library.dtos.request.BookRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.AuthorResponse;
import com.digitallibrary.digital_library.dtos.response.BookResponse;
import com.digitallibrary.digital_library.dtos.response.CategoryResponse;
import com.digitallibrary.digital_library.models.Author;
import com.digitallibrary.digital_library.models.Book;
import com.digitallibrary.digital_library.models.Category;
import com.digitallibrary.digital_library.repositories.AuthorRepository;
import com.digitallibrary.digital_library.repositories.BookRepository;
import com.digitallibrary.digital_library.repositories.CategoryRepository;
import com.digitallibrary.digital_library.services.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public BookServiceImpl(BookRepository bookRepository,
                          AuthorRepository authorRepository,
                          CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest bookRequest) { 
        if (bookRepository.existsByIsbn(bookRequest.getIsbn())) {
            throw new RuntimeException("El ISBN ya está registrado");
        }

        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setPublicationYear(bookRequest.getPublicationYear());
        book.setPublisher(bookRequest.getPublisher());
        book.setEdition(bookRequest.getEdition());
        book.setLanguage(bookRequest.getLanguage());
        book.setPages(bookRequest.getPages());
        book.setCoverImageUrl(bookRequest.getCoverImageUrl());
        book.setTotalCopies(bookRequest.getTotalCopies());
        book.setAvailableCopies(bookRequest.getAvailableCopies() != null ? 
            bookRequest.getAvailableCopies() : bookRequest.getTotalCopies());
        book.setLocation(bookRequest.getLocation());
 
        List<Author> authors = authorRepository.findAllById(bookRequest.getAuthorIds());
        book.setAuthors(authors.stream().collect(Collectors.toSet()));
 
        List<Category> categories = categoryRepository.findAllById(bookRequest.getCategoryIds());
        book.setCategories(categories.stream().collect(Collectors.toSet()));

        book = bookRepository.save(book);
        return convertToResponse(book);
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest bookRequest) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
 
        if (!book.getIsbn().equals(bookRequest.getIsbn()) && 
            bookRepository.existsByIsbn(bookRequest.getIsbn())) {
            throw new RuntimeException("El ISBN ya está registrado");
        }

        book.setTitle(bookRequest.getTitle());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setPublicationYear(bookRequest.getPublicationYear());
        book.setPublisher(bookRequest.getPublisher());
        book.setEdition(bookRequest.getEdition());
        book.setLanguage(bookRequest.getLanguage());
        book.setPages(bookRequest.getPages());
        book.setCoverImageUrl(bookRequest.getCoverImageUrl());
        book.setTotalCopies(bookRequest.getTotalCopies());
        book.setLocation(bookRequest.getLocation());
 
        List<Author> authors = authorRepository.findAllById(bookRequest.getAuthorIds());
        book.getAuthors().clear();
        book.getAuthors().addAll(authors);
 
        List<Category> categories = categoryRepository.findAllById(bookRequest.getCategoryIds());
        book.getCategories().clear();
        book.getCategories().addAll(categories);

        book = bookRepository.save(book);
        return convertToResponse(book);
    }

    @Override
    @Transactional
    public ApiResponse deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
 
        if (book.getAvailableCopies() < book.getTotalCopies()) {
            throw new RuntimeException("No se puede eliminar el libro porque tiene préstamos activos");
        }

        bookRepository.delete(book);
        return ApiResponse.success("Libro eliminado exitosamente");
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        return convertToResponse(book);
    }

    @Override
    public BookResponse getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        return convertToResponse(book);
    }

    @Override
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
            .map(this::convertToResponse);
    }

    @Override
    public Page<BookResponse> searchBooks(String title, String author, Long categoryId, 
                                         Integer publicationYear, String language, Pageable pageable) {
        return bookRepository.searchBooks(title, author, categoryId, publicationYear, language, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public List<BookResponse> getBooksByAuthor(Long authorId) {
        return bookRepository.findByAuthorNameContaining("", null) // Se necesita mejorar esta consulta
            .stream()
            .filter(book -> book.getAuthors().stream().anyMatch(a -> a.getId().equals(authorId)))
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> getAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0, null)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<BookResponse> publicSearch(String keyword, String category, String author, Pageable pageable) {
        return bookRepository.publicSearch(keyword, category, author, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public List<BookResponse> getPopularBooks(int limit, LocalDate startDate, LocalDate endDate) {
        return bookRepository.findPopularBooks(startDate, endDate, 
                org.springframework.data.domain.PageRequest.of(0, limit))
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public ApiResponse updateBookCopies(Long bookId, Integer copies) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        if (copies < 0) {
            throw new RuntimeException("El número de copias no puede ser negativo");
        }

        int currentLoans = book.getTotalCopies() - book.getAvailableCopies();
        if (copies < currentLoans) {
            throw new RuntimeException("No se puede reducir el número de copias porque hay préstamos activos");
        }

        book.setTotalCopies(copies);
        book.setAvailableCopies(copies - currentLoans);
        bookRepository.save(book);

        return ApiResponse.success("Copias actualizadas exitosamente");
    }

    @Override
    public boolean isBookAvailable(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        return book.getAvailableCopies() > 0;
    }

    private BookResponse convertToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setIsbn(book.getIsbn());
        response.setDescription(book.getDescription());
        response.setPublicationYear(book.getPublicationYear());
        response.setPublisher(book.getPublisher());
        response.setEdition(book.getEdition());
        response.setLanguage(book.getLanguage());
        response.setPages(book.getPages());
        response.setCoverImageUrl(book.getCoverImageUrl());
        response.setTotalCopies(book.getTotalCopies());
        response.setAvailableCopies(book.getAvailableCopies());
        response.setLocation(book.getLocation());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
 
        if (book.getAuthors() != null) {
            List<AuthorResponse> authors = book.getAuthors().stream()
                .map(author -> {
                    AuthorResponse authorResponse = new AuthorResponse();
                    authorResponse.setId(author.getId());
                    authorResponse.setName(author.getName());
                    authorResponse.setNationality(author.getNationality());
                    authorResponse.setBirthDate(author.getBirthDate());
                    authorResponse.setBiography(author.getBiography());
                    return authorResponse;
                })
                .collect(Collectors.toList());
            response.setAuthors(authors);
        }
 
        if (book.getCategories() != null) {
            List<CategoryResponse> categories = book.getCategories().stream()
                .map(category -> {
                    CategoryResponse categoryResponse = new CategoryResponse();
                    categoryResponse.setId(category.getId());
                    categoryResponse.setName(category.getName());
                    categoryResponse.setDescription(category.getDescription());
                    return categoryResponse;
                })
                .collect(Collectors.toList());
            response.setCategories(categories);
        }

        return response;
    }
}
