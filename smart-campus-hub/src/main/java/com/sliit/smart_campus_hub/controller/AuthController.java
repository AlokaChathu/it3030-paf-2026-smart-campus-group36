package com.sliit.smart_campus_hub.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import com.sliit.smart_campus_hub.dto.ForgotPasswordRequest;
import com.sliit.smart_campus_hub.dto.ResetPasswordWithOtpRequest;

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

    /** When false, demo mode: skip OTP email and mark email verified so login works without mail. */
    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already taken!"));
        }

        // Determine role (default USER if not provided or invalid)
        Role role = Role.USER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid role. Allowed: USER, TECHNICIAN, MANAGER, ADMIN"));
            }
        }

        final boolean demoSkipEmail = !mailEnabled;
        final String otp = demoSkipEmail ? null : String.format("%06d", new Random().nextInt(999999));
        final LocalDateTime otpExpiry = demoSkipEmail ? null : LocalDateTime.now().plusMinutes(10);

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(role)
                .provider(AuthProvider.LOCAL)
                .emailVerified(demoSkipEmail)
                .otp(otp)
                .otpExpiry(otpExpiry)
                .createdAt(new java.util.Date())
                .updatedAt(new java.util.Date())
                .build();

        userService.saveUser(user);

        if (demoSkipEmail) {
            return ResponseEntity.ok(new ApiResponse(true,
                    "Registration successful. Demo mode (mail disabled): you can log in without OTP verification."));
        }

        // Mail enabled: send OTP; failures are handled inside EmailService (logs OTP, does not throw).
        emailService.sendOtpEmail(request.getEmail(), otp);
        return ResponseEntity.ok(new ApiResponse(true, "Registration successful. Check your email for the OTP."));
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

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    Optional<User> userOpt = userService.findByEmail(request.getEmail());
    if (userOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Email not found"));
    }
    User user = userOpt.get();
    
    // Generate 6-digit OTP
    String otp = String.format("%06d", new Random().nextInt(999999));
    LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
    user.setResetOtp(otp);
    user.setResetOtpExpiry(expiry);
    userService.saveUser(user);
    
    // Service handles mail-failure fallback by logging OTP to console.
    emailService.sendPasswordResetOtp(request.getEmail(), otp);
    return ResponseEntity.ok(new ApiResponse(true, "Password reset OTP sent to your email"));
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordWithOtpRequest request) {
    Optional<User> userOpt = userService.findByEmail(request.getEmail());
    if (userOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found"));
    }
    User user = userOpt.get();
    
    if (user.getResetOtp() == null || user.getResetOtpExpiry() == null) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "No password reset request found. Please request OTP first."));
    }
    if (user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "OTP has expired. Please request a new one."));
    }
    if (!user.getResetOtp().equals(request.getOtp())) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid OTP"));
    }
    
    // Update password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    user.setResetOtp(null);
    user.setResetOtpExpiry(null);
    // In demo flow, treat successful reset OTP verification as account verification too.
    user.setEmailVerified(true);
    user.setOtp(null);
    user.setOtpExpiry(null);
    userService.saveUser(user);
    
    return ResponseEntity.ok(new ApiResponse(true, "Password reset successfully. You can now log in with your new password."));
}


}