package com.sliit.smart_campus_hub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordWithOtpRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String otp;
    
    @NotBlank
    private String newPassword;
}