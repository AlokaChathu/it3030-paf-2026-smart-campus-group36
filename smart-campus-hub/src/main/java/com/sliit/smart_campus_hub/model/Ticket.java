package com.sliit.smart_campus_hub.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.sliit.smart_campus_hub.enums.TicketCategory;
import com.sliit.smart_campus_hub.enums.TicketPriority;
import com.sliit.smart_campus_hub.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    
    // Link to resource from Module A (can be null if not linked to specific resource)
    private String resourceId;
    
    @Indexed
    private String createdBy;  // User ID who created the ticket
    
    private String assignedTo;  // User ID of assigned technician (null if not assigned)
    
    private String location;
    private String contactDetails;
    
    private String rejectionReason;  // Only populated when status is REJECTED
    
    // Rating fields (1-5 stars)
    private Integer rating;  // 1-5, null if not rated
    private String ratedBy;  // User ID who submitted the rating
    private Date ratedAt;  // When the rating was submitted
    
    private Date createdAt;
    private Date updatedAt;
}
