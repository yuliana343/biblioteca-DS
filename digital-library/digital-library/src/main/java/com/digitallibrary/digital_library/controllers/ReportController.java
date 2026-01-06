package com.digitallibrary.digital_library.controllers;
 

import com.digitallibrary.digital_library.services.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/loans/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getLoanSummaryReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(reportService.generateLoanSummaryReport(startDate, endDate));
    }

    @GetMapping("/loans/monthly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getMonthlyLoanReport(
            @RequestParam int year,
            @RequestParam(required = false) Integer month) {
        
        return ResponseEntity.ok(reportService.generateMonthlyLoanReport(year, month));
    }

    @GetMapping("/books/popular")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getPopularBooksReport(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(reportService.generatePopularBooksReport(limit, startDate, endDate));
    }

    @GetMapping("/users/activity")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getUserActivityReport(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(reportService.generateUserActivityReport(limit, startDate, endDate));
    }

    @GetMapping("/overdue/details")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getOverdueLoansReport() {
        return ResponseEntity.ok(reportService.generateOverdueLoansReport());
    }

    @GetMapping("/categories/usage")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getCategoryUsageReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        return ResponseEntity.ok(reportService.generateCategoryUsageReport(startDate, endDate));
    }

    @GetMapping("/reservations/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getReservationStatsReport() {
        return ResponseEntity.ok(reportService.generateReservationStatsReport());
    }

    @GetMapping("/system/health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemHealthReport() {
        return ResponseEntity.ok(reportService.generateSystemHealthReport());
    }

    @GetMapping("/export/loans")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> exportLoansReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "pdf") String format) {
        
        return ResponseEntity.ok(reportService.exportLoansReport(startDate, endDate, format));
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getDashboardStatistics() {
        return ResponseEntity.ok(reportService.getDashboardStatistics());
    }
}