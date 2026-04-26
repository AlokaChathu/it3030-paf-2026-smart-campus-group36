package com.sliit.smart_campus_hub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String to, String otp) {
        if (!isReadyToSend()) {
            logOtpFallback(to, otp, "Email verification");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (!fromEmail.isBlank()) {
            message.setFrom(fromEmail);
        }
        message.setTo(to);
        message.setSubject("Smart Campus Hub - Email Verification OTP");
        message.setText("Your OTP for email verification is: " + otp + "\n\nThis OTP expires in 10 minutes.");
        sendSafely(message, to, otp, "Email verification");
    }

    public void sendPasswordResetOtp(String to, String otp) {
        if (!isReadyToSend()) {
            logOtpFallback(to, otp, "Password reset");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (!fromEmail.isBlank()) {
            message.setFrom(fromEmail);
        }
        message.setTo(to);
        message.setSubject("Smart Campus Hub - Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP expires in 10 minutes.");
        sendSafely(message, to, otp, "Password reset");
    }

    private boolean isReadyToSend() {
        return mailEnabled && mailSender != null;
    }

    private void sendSafely(SimpleMailMessage message, String to, String otp, String flow) {
        try {
            mailSender.send(message);
        } catch (Exception ex) {
            logger.warn("{} OTP email failed for {}. Falling back to console OTP log. Reason: {}",
                    flow, to, ex.getMessage());
            logOtpFallback(to, otp, flow);
        }
    }

    private void logOtpFallback(String to, String otp, String flow) {
        logger.info("[OTP FALLBACK] {} OTP for {} is {}", flow, to, otp);
    }
}