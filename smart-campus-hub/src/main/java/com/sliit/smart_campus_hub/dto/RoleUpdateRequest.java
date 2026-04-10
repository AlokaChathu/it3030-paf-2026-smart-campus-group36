package com.sliit.smart_campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotBlank
    private String role;  // USER, TECHNICIAN, MANAGER, ADMIN
}