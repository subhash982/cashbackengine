package com.cashback.engine.service;

import com.cashback.engine.domain.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    @Async
    public void notifyCashbackEvent(User user, String event, BigDecimal cashbackAmount) {
        String subject = buildSubject(event, cashbackAmount);
        String body = buildBody(user.getFirstName(), event, cashbackAmount);
        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildSubject(String event, BigDecimal cashbackAmount) {
        return switch (event) {
            case "tracked" -> "Cashback Tracked: $" + cashbackAmount;
            case "confirmed" -> "Cashback Confirmed: $" + cashbackAmount;
            case "paid" -> "Cashback Paid: $" + cashbackAmount;
            default -> "Cashback Update";
        };
    }

    private String buildBody(String firstName, String event, BigDecimal cashbackAmount) {
        return switch (event) {
            case "tracked" -> String.format("Hi %s, your cashback of $%s has been tracked and is pending confirmation.", firstName, cashbackAmount);
            case "confirmed" -> String.format("Hi %s, your cashback of $%s has been confirmed and is ready for withdrawal.", firstName, cashbackAmount);
            case "paid" -> String.format("Hi %s, your cashback of $%s has been paid out successfully!", firstName, cashbackAmount);
            default -> String.format("Hi %s, there is an update on your cashback of $%s.", firstName, cashbackAmount);
        };
    }
}
