package com.digitallibrary.digital_library.services;
 
import java.time.LocalDate; 
public interface EmailService {
    void sendWelcomeEmail(String to, String username);
    void sendLoanConfirmation(String to, String bookTitle, LocalDate dueDate);
    void sendReturnReminder(String to, String bookTitle, LocalDate dueDate);
    void sendOverdueNotification(String to, String bookTitle, int daysOverdue);
    void sendReservationAvailable(String to, String bookTitle);
    void sendPasswordReset(String to, String resetToken);
    void sendNotification(String to, String subject, String message);
}