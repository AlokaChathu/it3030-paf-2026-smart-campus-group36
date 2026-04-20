package com.sliit.smart_campus_hub.dto;

import com.sliit.smart_campus_hub.enums.TicketCategory;
import com.sliit.smart_campus_hub.enums.TicketPriority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTicketRequest {
    
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private String resourceId;
    private String location;
    private String contactDetails;
}
