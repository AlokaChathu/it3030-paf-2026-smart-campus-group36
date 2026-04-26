package com.sliit.smart_campus_hub.dto;

import java.util.Date;

import com.sliit.smart_campus_hub.enums.TicketCategory;
import com.sliit.smart_campus_hub.enums.TicketPriority;
import com.sliit.smart_campus_hub.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
    private String id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String resourceId;
    private String createdBy;
    private String assignedTo;
    private String assignedToName;  // Technician name
    private String location;
    private String contactDetails;
    private String rejectionReason;
    private Integer rating;
    private String ratedBy;
    private Date ratedAt;
    private Date createdAt;
    private Date updatedAt;
}
