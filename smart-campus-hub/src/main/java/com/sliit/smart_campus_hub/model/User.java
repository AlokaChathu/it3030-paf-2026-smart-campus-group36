package com.sliit.smart_campus_hub.model;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.sliit.smart_campus_hub.enums.AuthProvider;
import com.sliit.smart_campus_hub.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password; // null for Google users
    
    private String name;
    private String fullName;
    private String address;
    private Integer age;
    private String phoneNumber;
    
    private Role role;
    
    private AuthProvider provider;
    
    private Boolean emailVerified;
    
    private String otp;           // 6-digit code
    private LocalDateTime otpExpiry;
    
    // For password reset (optional, kept for future)
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    
    private Date createdAt;
    private Date updatedAt;

    private String resetOtp;               // 6-digit OTP for password reset
    private LocalDateTime resetOtpExpiry;  // expiry time

    
}