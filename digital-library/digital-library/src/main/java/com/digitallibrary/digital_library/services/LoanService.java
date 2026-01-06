package com.digitallibrary.digital_library.services;
 

import com.digitallibrary.digital_library.dtos.request.LoanRequest;
import com.digitallibrary.digital_library.dtos.response.ApiResponse;
import com.digitallibrary.digital_library.dtos.response.LoanResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface LoanService {
    LoanResponse createLoan(LoanRequest loanRequest);
    LoanResponse getLoanById(Long id);
    List<LoanResponse> getLoansByUser(Long userId);
    List<LoanResponse> getLoansByBook(Long bookId);
    Page<LoanResponse> getAllLoans(String status, LocalDate startDate, LocalDate endDate, Pageable pageable);
    List<LoanResponse> getActiveLoans();
    List<LoanResponse> getOverdueLoans();
    LoanResponse returnLoan(Long id);
    LoanResponse renewLoan(Long id);
    LoanResponse updateLoanStatus(Long id, String status);
    ApiResponse deleteLoan(Long id);
    List<LoanResponse> getMyLoans();
    Map<String, Object> getLoanStats();
    boolean canRenewLoan(Long loanId);
    boolean hasOverdueLoans(Long userId);
    int getUserLoanCount(Long userId);
}