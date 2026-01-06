package com.digitallibrary.digital_library.controllers;
 

import com.digitallibrary.digital_library.dtos.request.LoanRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.LoanResponse;
import com.digitallibrary.digital_library.services.LoanService;
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
@RequestMapping("api/loans")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<LoanResponse> createLoan(@Valid @RequestBody LoanRequest loanRequest) {
        LoanResponse loan = loanService.createLoan(loanRequest);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable Long id) {
        LoanResponse loan = loanService.getLoanById(id);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> getLoansByUser(@PathVariable Long userId) {
        List<LoanResponse> loans = loanService.getLoansByUser(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getLoansByBook(@PathVariable Long bookId) {
        List<LoanResponse> loans = loanService.getLoansByBook(bookId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<Page<LoanResponse>> getAllLoans(
            Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Page<LoanResponse> loans = loanService.getAllLoans(status, startDate, endDate, pageable);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getActiveLoans() {
        List<LoanResponse> loans = loanService.getActiveLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getOverdueLoans() {
        List<LoanResponse> loans = loanService.getOverdueLoans();
        return ResponseEntity.ok(loans);
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<LoanResponse> returnLoan(@PathVariable Long id) {
        LoanResponse loan = loanService.returnLoan(id);
        return ResponseEntity.ok(loan);
    }

    @PatchMapping("/{id}/renew")
    public ResponseEntity<LoanResponse> renewLoan(@PathVariable Long id) {
        LoanResponse loan = loanService.renewLoan(id);
        return ResponseEntity.ok(loan);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<LoanResponse> updateLoanStatus(@PathVariable Long id,
            @RequestParam String status) {
        LoanResponse loan = loanService.updateLoanStatus(id, status);
        return ResponseEntity.ok(loan);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteLoan(@PathVariable Long id) {
        ApiResponse response = loanService.deleteLoan(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanResponse>> getMyLoans() {
        List<LoanResponse> loans = loanService.getMyLoans();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/stats/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LIBRARIAN')")
    public ResponseEntity<?> getLoanStats() {
        return ResponseEntity.ok(loanService.getLoanStats());
    }
}