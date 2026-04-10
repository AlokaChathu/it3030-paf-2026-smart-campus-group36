package com.sliit.smart_campus_hub.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.dto.OtpVerificationRequest;
import com.sliit.smart_campus_hub.dto.RegisterRequest;
import com.sliit.smart_campus_hub.enums.AuthProvider;
import com.sliit.smart_campus_hub.enums.Role;
import com.sliit.smart_campus_hub.model.User;
import com.sliit.smart_campus_hub.service.EmailService;
import com.sliit.smart_campus_hub.service.UserService;
import com.sliit.smart_campus_hub.dto.LoginRequest;
import com.sliit.smart_campus_hub.dto.JwtResponse;
import com.sliit.smart_campus_hub.utils.JwtUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already taken!"));
        }

        // Generate OTP (6 digits)
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(10);

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .emailVerified(false)
                .otp(otp)
                .otpExpiry(otpExpiry)
                .createdAt(new java.util.Date())
                .updatedAt(new java.util.Date())
                .build();

        userService.saveUser(user);

        // Send OTP email
        try {
            emailService.sendOtpEmail(request.getEmail(), otp);
        } catch (Exception e) {
            // If email fails, still user is saved but not verified - log error
            System.err.println("Failed to send OTP email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "User registered but failed to send OTP. Please contact support."));
        }

        return ResponseEntity.ok(new ApiResponse(true, "Registration successful. OTP sent to your email."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found"));
        }
        
        User user = userOpt.get();
        
        if (user.getEmailVerified()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email already verified"));
        }
        
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "No OTP request found. Please register again."));
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "OTP has expired. Please register again."));
        }
        
        if (!user.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid OTP"));
        }
        
        // Verify user
        user.setEmailVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setUpdatedAt(new java.util.Date());
        userService.saveUser(user);
        
        return ResponseEntity.ok(new ApiResponse(true, "Email verified successfully. You can now log in."));
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    // Check if user exists and email verified
    Optional<User> userOpt = userService.findByEmail(request.getEmail());
    if (userOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found"));
    }

    User user = userOpt.get();

    if (!user.getEmailVerified()) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Email not verified. Please verify OTP first."));
    }

    // Check password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid password"));
    }

    // Generate JWT
    String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());

    return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getEmail(), user.getRole().name()));
}
}