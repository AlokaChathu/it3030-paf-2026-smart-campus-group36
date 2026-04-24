package com.sliit.smart_campus_hub.dto.booking;

import com.sliit.smart_campus_hub.enums.BookingStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String rejectionReason;
}
