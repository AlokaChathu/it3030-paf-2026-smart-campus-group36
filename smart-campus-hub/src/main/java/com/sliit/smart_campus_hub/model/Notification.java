package com.sliit.smart_campus_hub.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String userId;
    private String message;          // notification body
    private String eventType;        // e.g., "BOOKING_APPROVED"
    private boolean isRead;
    private LocalDateTime createdAt;
}