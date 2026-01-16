package com.digitallibrary.digital_library.services.impl;
 
import java.time.LocalDate;  
import com.digitallibrary.digital_library.services.EmailService;
import org.springframework.stereotype.Service;
 

@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendWelcomeEmail(String to, String username) { 
        System.out.println("Enviando email de bienvenida a: " + to);
        System.out.println("Bienvenido " + username + " a la Biblioteca Digital");
    }

    @Override
    public void sendLoanConfirmation(String to, String bookTitle, LocalDate dueDate) {
        System.out.println("Enviando confirmación de préstamo a: " + to);
        System.out.println("Libro: " + bookTitle);
        System.out.println("Fecha de devolución: " + dueDate);
    }

    @Override
    public void sendReturnReminder(String to, String bookTitle, LocalDate dueDate) {
        System.out.println("Enviando recordatorio de devolución a: " + to);
        System.out.println("Libro: " + bookTitle);
        System.out.println("Fecha límite: " + dueDate);
    }

    @Override
    public void sendOverdueNotification(String to, String bookTitle, int daysOverdue) {
        System.out.println("Enviando notificación de vencimiento a: " + to);
        System.out.println("Libro: " + bookTitle);
        System.out.println("Días de retraso: " + daysOverdue);
    }

    @Override
    public void sendReservationAvailable(String to, String bookTitle) {
        System.out.println("Enviando notificación de reserva disponible a: " + to);
        System.out.println("Libro: " + bookTitle + " está disponible");
    }

    @Override
    public void sendPasswordReset(String to, String resetToken) {
        System.out.println("Enviando enlace de recuperación a: " + to);
        System.out.println("Token: " + resetToken);
    }

    @Override
    public void sendNotification(String to, String subject, String message) {
        System.out.println("Enviando notificación a: " + to);
        System.out.println("Asunto: " + subject);
        System.out.println("Mensaje: " + message);
    }
}
