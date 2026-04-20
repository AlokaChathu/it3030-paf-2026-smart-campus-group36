package com.sliit.smart_campus_hub.dto;

import com.sliit.smart_campus_hub.enums.TicketStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    
    @NotNull(message = "Status is required")
    private TicketStatus status;
    
    private String rejectionReason;  // Required when status is REJECTED
}
