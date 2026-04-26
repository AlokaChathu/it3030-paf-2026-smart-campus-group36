package com.sliit.smart_campus_hub.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.dto.PasswordChangeRequest;
import com.sliit.smart_campus_hub.dto.ProfileUpdateRequest;
import com.sliit.smart_campus_hub.model.User;
import com.sliit.smart_campus_hub.service.EmailService;
import com.sliit.smart_campus_hub.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        // Remove sensitive fields before sending
        user.setPassword(null);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @Valid @RequestBody ProfileUpdateRequest request) {
        User user = userService.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());

        user.setUpdatedAt(new java.util.Date());
        userService.saveUser(user);
        return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody PasswordChangeRequest request) {
        User user = userService.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        // If user has a password (local user or Google user who set one), verify current password
        if (user.getPassword() != null && !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Current password is incorrect"));
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.saveUser(user);
        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
    }

    @PostMapping("/me/resend-verification")
    public ResponseEntity<?> resendVerificationOtp(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        if (user.getEmailVerified()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email already verified"));
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(10);
        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);
        userService.saveUser(user);

        // Service handles mail-failure fallback by logging OTP to console.
        emailService.sendOtpEmail(user.getEmail(), otp);
        return ResponseEntity.ok(new ApiResponse(true, "Verification OTP resent to your email"));
    }

    // Get users by role - ADMIN only
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            // Remove sensitive fields
            users.forEach(user -> {
                user.setPassword(null);
                user.setOtp(null);
                user.setOtpExpiry(null);
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
            });
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get user by ID - ADMIN only
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            // Remove sensitive fields
            user.setPassword(null);
            user.setOtp(null);
            user.setOtpExpiry(null);
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

}