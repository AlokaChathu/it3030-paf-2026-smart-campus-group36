package com.sliit.smart_campus_hub.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.sliit.smart_campus_hub.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    @Indexed
    private Long resourceId;

    @Indexed
    private String userId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private String purpose;
    private int attendees;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
