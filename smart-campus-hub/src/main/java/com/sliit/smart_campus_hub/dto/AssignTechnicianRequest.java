package com.sliit.smart_campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignTechnicianRequest {
    
    @NotBlank(message = "Technician ID is required")
    private String technicianId;
}
