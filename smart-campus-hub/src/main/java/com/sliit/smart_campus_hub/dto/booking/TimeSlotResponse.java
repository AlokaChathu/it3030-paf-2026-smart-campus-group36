package com.sliit.smart_campus_hub.dto.booking;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeSlotResponse {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
