package com.sliit.smart_campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketTrendResponse {
    private String date;  // Date in YYYY-MM-DD format
    private Long count;  // Number of tickets created on this date
}
