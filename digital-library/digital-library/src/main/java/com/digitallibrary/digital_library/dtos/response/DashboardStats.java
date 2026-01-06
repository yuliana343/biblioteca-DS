package com.digitallibrary.digital_library.dtos.response;
 

import java.util.List;
import java.util.Map;

public class DashboardStats {
    
    private Long totalBooks;
    private Long totalUsers;
    private Long totalActiveLoans;
    private Long totalOverdueLoans;
    private Long totalReservations;
    private Long totalAuthors;
    private Long totalCategories;
    
    private Map<String, Long> booksByCategory;
    private Map<String, Long> loansByStatus;
    private Map<String, Long> usersByRole;
    
    private List<BookResponse> popularBooks;
    private List<UserResponse> activeUsers;
    
    private Integer averageLoansPerDay;
    private Double averageLoanDuration;
    private Double returnOnTimeRate;
    
    private Long newLoansThisMonth;
    private Long booksAddedThisMonth;
    private Long newUsersThisMonth;
    
    private List<Map<String, Object>> monthlyStats;
    private List<Map<String, Object>> dailyActivity;

    // Getters y Setters
    public Long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(Long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalActiveLoans() {
        return totalActiveLoans;
    }

    public void setTotalActiveLoans(Long totalActiveLoans) {
        this.totalActiveLoans = totalActiveLoans;
    }

    public Long getTotalOverdueLoans() {
        return totalOverdueLoans;
    }

    public void setTotalOverdueLoans(Long totalOverdueLoans) {
        this.totalOverdueLoans = totalOverdueLoans;
    }

    public Long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(Long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Long getTotalAuthors() {
        return totalAuthors;
    }

    public void setTotalAuthors(Long totalAuthors) {
        this.totalAuthors = totalAuthors;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Map<String, Long> getBooksByCategory() {
        return booksByCategory;
    }

    public void setBooksByCategory(Map<String, Long> booksByCategory) {
        this.booksByCategory = booksByCategory;
    }

    public Map<String, Long> getLoansByStatus() {
        return loansByStatus;
    }

    public void setLoansByStatus(Map<String, Long> loansByStatus) {
        this.loansByStatus = loansByStatus;
    }

    public Map<String, Long> getUsersByRole() {
        return usersByRole;
    }

    public void setUsersByRole(Map<String, Long> usersByRole) {
        this.usersByRole = usersByRole;
    }

    public List<BookResponse> getPopularBooks() {
        return popularBooks;
    }

    public void setPopularBooks(List<BookResponse> popularBooks) {
        this.popularBooks = popularBooks;
    }

    public List<UserResponse> getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(List<UserResponse> activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Integer getAverageLoansPerDay() {
        return averageLoansPerDay;
    }

    public void setAverageLoansPerDay(Integer averageLoansPerDay) {
        this.averageLoansPerDay = averageLoansPerDay;
    }

    public Double getAverageLoanDuration() {
        return averageLoanDuration;
    }

    public void setAverageLoanDuration(Double averageLoanDuration) {
        this.averageLoanDuration = averageLoanDuration;
    }

    public Double getReturnOnTimeRate() {
        return returnOnTimeRate;
    }

    public void setReturnOnTimeRate(Double returnOnTimeRate) {
        this.returnOnTimeRate = returnOnTimeRate;
    }

    public Long getNewLoansThisMonth() {
        return newLoansThisMonth;
    }

    public void setNewLoansThisMonth(Long newLoansThisMonth) {
        this.newLoansThisMonth = newLoansThisMonth;
    }

    public Long getBooksAddedThisMonth() {
        return booksAddedThisMonth;
    }

    public void setBooksAddedThisMonth(Long booksAddedThisMonth) {
        this.booksAddedThisMonth = booksAddedThisMonth;
    }

    public Long getNewUsersThisMonth() {
        return newUsersThisMonth;
    }

    public void setNewUsersThisMonth(Long newUsersThisMonth) {
        this.newUsersThisMonth = newUsersThisMonth;
    }

    public List<Map<String, Object>> getMonthlyStats() {
        return monthlyStats;
    }

    public void setMonthlyStats(List<Map<String, Object>> monthlyStats) {
        this.monthlyStats = monthlyStats;
    }

    public List<Map<String, Object>> getDailyActivity() {
        return dailyActivity;
    }

    public void setDailyActivity(List<Map<String, Object>> dailyActivity) {
        this.dailyActivity = dailyActivity;
    }
}