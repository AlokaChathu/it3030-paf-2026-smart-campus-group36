package com.sliit.smart_campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianRatingResponse {
    private String technicianId;
    private String technicianName;
    private Double averageRating;  // Average rating (1-5)
    private Long totalRatings;  // Total number of ratings received
}
