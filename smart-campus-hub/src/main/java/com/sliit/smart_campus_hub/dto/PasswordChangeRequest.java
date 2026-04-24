package com.sliit.smart_campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String currentPassword; // optional for Google users without password
    @NotBlank
    private String newPassword;
}