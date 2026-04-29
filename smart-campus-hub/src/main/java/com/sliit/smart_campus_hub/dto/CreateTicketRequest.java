package com.sliit.smart_campus_hub.dto;

import com.sliit.smart_campus_hub.enums.TicketCategory;
import com.sliit.smart_campus_hub.enums.TicketPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Category is required")
    private TicketCategory category;
    
    @NotNull(message = "Priority is required")
    private TicketPriority priority;
    
    private String resourceId;  // Optional - link to resource
    private String location;
    private String contactDetails;
}
