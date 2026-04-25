package com.sliit.smart_campus_hub.dto.booking;

import java.time.LocalDateTime;

import com.sliit.smart_campus_hub.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private String id;
    private Long resourceId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private String purpose;
    private int attendees;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
