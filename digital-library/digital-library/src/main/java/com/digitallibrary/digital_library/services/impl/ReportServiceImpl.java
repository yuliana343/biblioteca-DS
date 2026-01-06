package com.digitallibrary.digital_library.services.impl;

import com.digitallibrary.digital_library.models.*;
import com.digitallibrary.digital_library.models.enums.*;
import com.digitallibrary.digital_library.repositories.*;
import com.digitallibrary.digital_library.services.ReportService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ReservationRepository reservationRepository;

    public ReportServiceImpl(LoanRepository loanRepository,
                            BookRepository bookRepository,
                            UserRepository userRepository,
                            CategoryRepository categoryRepository,
                            ReservationRepository reservationRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Map<String, Object> generateLoanSummaryReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Estadísticas básicas
        report.put("totalLoans", loanRepository.count());
        report.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        report.put("overdueLoans", loanRepository.countByStatus(LoanStatus.OVERDUE));
        report.put("returnedLoans", loanRepository.countByStatus(LoanStatus.RETURNED));
        
        // Préstamos en el período
        if (startDate != null && endDate != null) {
            long loansInPeriod = loanRepository.countByLoanDateBetween(startDate, endDate);
            report.put("loansInPeriod", loansInPeriod);
        }
        
        // Libros más prestados
        List<Object[]> mostLoanedBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, 10));
        report.put("mostLoanedBooks", mostLoanedBooks);
        
        // Usuarios más activos - CORRECCIÓN: el repositorio devuelve List<User>
        List<User> mostActiveUsers = userRepository.findMostActiveUsers(PageRequest.of(0, 10));
        List<Object[]> mostActiveUsersFormatted = mostActiveUsers.stream()
            .map(user -> new Object[]{
                user.getId(), 
                user.getUsername(), 
                user.getEmail(),
                user.getLoans().size()
            })
            .collect(Collectors.toList());
        report.put("mostActiveUsers", mostActiveUsersFormatted);
        
        report.put("generatedAt", LocalDate.now());
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateMonthlyLoanReport(int year, Integer month) {
        Map<String, Object> report = new HashMap<>();
        
        LocalDate startDate;
        LocalDate endDate;
        
        if (month != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else {
            startDate = LocalDate.of(year, 1, 1);
            endDate = LocalDate.of(year, 12, 31);
        }
        
        // Préstamos por mes
        List<Object[]> loansByMonth = loanRepository.getLoansByMonth(startDate);
        report.put("loansByMonth", loansByMonth);
        
        // Total de préstamos
        long totalLoans = loanRepository.countByLoanDateBetween(startDate, endDate);
        report.put("totalLoans", totalLoans);
        
        // Promedio diario
        long daysInPeriod = startDate.until(endDate).getDays() + 1;
        double dailyAverage = daysInPeriod > 0 ? (double) totalLoans / daysInPeriod : 0;
        report.put("dailyAverage", String.format("%.2f", dailyAverage));
        
        // Libros más prestados del mes
        List<Object[]> monthlyTopBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, 5));
        report.put("monthlyTopBooks", monthlyTopBooks);
        
        report.put("year", year);
        report.put("month", month != null ? month : "All");
        report.put("period", startDate + " to " + endDate);
        
        return report;
    }

    @Override
    public Map<String, Object> generatePopularBooksReport(int limit, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Libros más prestados
        List<Object[]> mostLoanedBooks = loanRepository.findMostLoanedBooks(
            startDate, endDate, PageRequest.of(0, limit));
        report.put("mostLoanedBooks", mostLoanedBooks);
        
        // Libros más reservados
        List<Object[]> mostReservedBooks = reservationRepository.findMostReservedBooks(
            startDate != null ? startDate.atStartOfDay() : null,
            endDate != null ? endDate.atTime(23, 59, 59) : null,
            PageRequest.of(0, limit));
        report.put("mostReservedBooks", mostReservedBooks);
        
        // Libros disponibles más populares - CORRECCIÓN: el repositorio devuelve List<Book>
        List<Book> availablePopularBooks = bookRepository.findPopularBooks(
            startDate, endDate, PageRequest.of(0, limit));
 // Línea 143 aproximadamente:
List<Object[]> availablePopularBooksFormatted = availablePopularBooks.stream()
    .map(book -> new Object[]{
        book.getId(),
        book.getTitle(),
        book.getAuthors().stream()  // CAMBIO AQUÍ
            .findFirst()
            .map(Author::getName)
            .orElse("Sin autor"),  // Y AQUÍ
        book.getAvailableCopies()
    })
    .collect(Collectors.toList());
        report.put("availablePopularBooks", availablePopularBooksFormatted);
        
        report.put("limit", limit);
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateUserActivityReport(int limit, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Usuarios más activos - CORRECCIÓN
        List<User> mostActiveUsers = userRepository.findMostActiveUsers(PageRequest.of(0, limit));
        List<Object[]> mostActiveUsersFormatted = mostActiveUsers.stream()
            .map(user -> new Object[]{
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getLoans().size()
            })
            .collect(Collectors.toList());
        report.put("mostActiveUsers", mostActiveUsersFormatted);
        
        // Usuarios con préstamos vencidos - CORRECCIÓN
        List<User> usersWithOverdueLoans = userRepository.findUsersWithOverdueLoans();
        List<Object[]> usersWithOverdueLoansFormatted = usersWithOverdueLoans.stream()
            .map(user -> new Object[]{
                user.getId(), 
                user.getUsername(), 
                user.getEmail(),
                user.getLoans().stream()
                    .filter(loan -> loan.getStatus() == LoanStatus.OVERDUE)
                    .count()
            })
            .collect(Collectors.toList());
        report.put("usersWithOverdueLoans", usersWithOverdueLoansFormatted);
        
        report.put("totalUsers", userRepository.count());
        report.put("activeUsers", userRepository.countByIsActiveTrue());
        report.put("limit", limit);
        
        return report;
    }

    @Override
    public Map<String, Object> generateOverdueLoansReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Préstamos vencidos - CORRECCIÓN: usa el paquete correcto
        List<Loan> overdueLoans = loanRepository.findOverdueLoans();
        report.put("overdueLoans", overdueLoans.stream()
            .map(loan -> {
                Map<String, Object> loanData = new HashMap<>();
                loanData.put("id", loan.getId());
                loanData.put("user", loan.getUser().getUsername());
                loanData.put("book", loan.getBook().getTitle());
                loanData.put("dueDate", loan.getDueDate());
                loanData.put("daysOverdue", 
                    ChronoUnit.DAYS.between(loan.getDueDate(), LocalDate.now()));
                loanData.put("fine", loan.getFineAmount());
                return loanData;
            })
            .collect(Collectors.toList()));
        
        // Total de multas pendientes
        double totalFines = overdueLoans.stream()
            .mapToDouble(loan -> loan.getFineAmount() != null ? loan.getFineAmount() : 0.0)
            .sum();
        report.put("totalFines", totalFines);
        
        // Usuarios con más préstamos vencidos
        Map<String, Integer> usersWithMostOverdue = new HashMap<>();
        overdueLoans.forEach(loan -> {
            String username = loan.getUser().getUsername();
            usersWithMostOverdue.put(username, 
                usersWithMostOverdue.getOrDefault(username, 0) + 1);
        });
        report.put("usersWithMostOverdue", usersWithMostOverdue);
        
        report.put("totalOverdue", overdueLoans.size());
        report.put("generatedAt", LocalDate.now());
        
        return report;
    }

    @Override
    public Map<String, Object> generateCategoryUsageReport(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> report = new HashMap<>();
        
        // Uso por categoría
        List<Object[]> categoryUsage = categoryRepository.getCategoryUsageStats(startDate, endDate);
        report.put("categoryUsage", categoryUsage);
        
        // Categorías con más libros - CORRECCIÓN
        List<Category> categoriesWithMostBooks = categoryRepository.findCategoriesWithMostBooks(
            PageRequest.of(0, 10));
        List<Object[]> categoriesWithMostBooksFormatted = categoriesWithMostBooks.stream()
            .map(category -> new Object[]{
                category.getId(),
                category.getName(),
                category.getBooks().size()
            })
            .collect(Collectors.toList());
        report.put("categoriesWithMostBooks", categoriesWithMostBooksFormatted);
        
        // Total de categorías
        report.put("totalCategories", categoryRepository.count());
        
        report.put("period", startDate != null && endDate != null ? 
            startDate + " to " + endDate : "All time");
        
        return report;
    }

    @Override
    public Map<String, Object> generateReservationStatsReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Estadísticas por estado
        List<Object[]> reservationStats = reservationRepository.getReservationStats();
        report.put("reservationStats", reservationStats);
        
        // Reservas activas
        List<Reservation> activeReservations = 
            reservationRepository.findByStatus(ReservationStatus.ACTIVE, PageRequest.of(0, 100))
                .getContent();
        report.put("activeReservations", activeReservations.size());
        
        // Reservas pendientes
        List<Reservation> pendingReservations = 
            reservationRepository.findByStatus(ReservationStatus.PENDING, PageRequest.of(0, 100))
                .getContent();
        report.put("pendingReservations", pendingReservations.size());
        
        // Libros más reservados
        List<Object[]> mostReservedBooks = reservationRepository.findMostReservedBooks(
            null, null, PageRequest.of(0, 10));
        report.put("mostReservedBooks", mostReservedBooks);
        
        report.put("totalReservations", reservationRepository.count());
        report.put("generatedAt", LocalDate.now());
        
        return report;
    }

    @Override
    public Map<String, Object> generateSystemHealthReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Estadísticas del sistema
        report.put("totalBooks", bookRepository.count());
        report.put("availableBooks", bookRepository.countByAvailableCopiesGreaterThan(0));
        report.put("totalUsers", userRepository.count());
        report.put("activeUsers", userRepository.countByIsActiveTrue());
        report.put("totalLoans", loanRepository.count());
        report.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        report.put("totalReservations", reservationRepository.count());
        report.put("totalCategories", categoryRepository.count());
        
        // Libros con pocas copias (menos de 3)
        List<Book> lowStockBooks = bookRepository.findByAvailableCopiesLessThan(3);
        report.put("lowStockBooks", lowStockBooks.size());
        
        // Préstamos próximos a vencer
        List<Loan> loansDueSoon = loanRepository.findLoansDueSoon(LocalDate.now().plusDays(3));
        report.put("loansDueSoon", loansDueSoon.size());
        
        // Reservas próximas a expirar
        List<Reservation> reservationsExpiringSoon = 
            reservationRepository.findReservationsExpiringSoon(LocalDateTime.now().plusHours(24));
        report.put("reservationsExpiringSoon", reservationsExpiringSoon.size());
        
        report.put("systemTime", LocalDateTime.now());
        report.put("databaseStatus", "Connected");
        
        return report;
    }

    @Override
    public byte[] exportLoansReport(LocalDate startDate, LocalDate endDate, String format) {
        // Implementación básica
        String reportContent = generateLoanSummaryReport(startDate, endDate).toString();
        
        if ("pdf".equalsIgnoreCase(format)) {
            // Generar PDF
            return reportContent.getBytes();
        } else if ("csv".equalsIgnoreCase(format)) {
            // Generar CSV
            return reportContent.getBytes();
        } else if ("excel".equalsIgnoreCase(format)) {
            // Generar Excel
            return reportContent.getBytes();
        }
        
        return reportContent.getBytes();
    }

    @Override
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estadísticas principales
        stats.put("totalBooks", bookRepository.count());
        stats.put("availableBooks", bookRepository.countByAvailableCopiesGreaterThan(0));
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByIsActiveTrue());
        stats.put("totalLoans", loanRepository.count());
        stats.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        stats.put("overdueLoans", loanRepository.countByStatus(LoanStatus.OVERDUE));
        stats.put("totalReservations", reservationRepository.count());
        
        // Préstamos del mes actual
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = LocalDate.now().withDayOfMonth(
            LocalDate.now().lengthOfMonth());
        stats.put("loansThisMonth", loanRepository.countByLoanDateBetween(
            firstDayOfMonth, lastDayOfMonth));
        
        // Libros más populares este mes
        List<Object[]> popularBooksThisMonth = loanRepository.findMostLoanedBooks(
            firstDayOfMonth, lastDayOfMonth, PageRequest.of(0, 5));
        stats.put("popularBooksThisMonth", popularBooksThisMonth);
        
        // Préstamos por mes (últimos 6 meses)
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Object[]> loansByMonth = loanRepository.getLoansByMonth(sixMonthsAgo);
        stats.put("loansByMonth", loansByMonth);
        
        // Categorías más populares
        List<Object[]> popularCategories = categoryRepository.getCategoryUsageStats(
            sixMonthsAgo, LocalDate.now());
        stats.put("popularCategories", popularCategories);
        
        stats.put("lastUpdated", LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        return stats;
    }
}