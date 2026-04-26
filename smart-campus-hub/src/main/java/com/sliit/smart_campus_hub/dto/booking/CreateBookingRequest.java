package com.sliit.smart_campus_hub.dto.booking;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBookingRequest {

    @NotNull(message = "resourceId is required")
    private String resourceId;

    @NotNull(message = "startTime is required")
    @Future(message = "startTime must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "endTime is required")
    @Future(message = "endTime must be in the future")
    private LocalDateTime endTime;

    @NotBlank(message = "purpose is required")
    private String purpose;

    @Min(value = 1, message = "attendees must be at least 1")
    private int attendees;
}
