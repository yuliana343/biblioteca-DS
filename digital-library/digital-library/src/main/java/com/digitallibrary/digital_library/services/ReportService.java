package com.digitallibrary.digital_library.services;
 

import java.time.LocalDate;
import java.util.Map;

public interface ReportService {
    Map<String, Object> generateLoanSummaryReport(LocalDate startDate, LocalDate endDate);
    Map<String, Object> generateMonthlyLoanReport(int year, Integer month);
    Map<String, Object> generatePopularBooksReport(int limit, LocalDate startDate, LocalDate endDate);
    Map<String, Object> generateUserActivityReport(int limit, LocalDate startDate, LocalDate endDate);
    Map<String, Object> generateOverdueLoansReport();
    Map<String, Object> generateCategoryUsageReport(LocalDate startDate, LocalDate endDate);
    Map<String, Object> generateReservationStatsReport();
    Map<String, Object> generateSystemHealthReport();
    byte[] exportLoansReport(LocalDate startDate, LocalDate endDate, String format);
    Map<String, Object> getDashboardStatistics();
}