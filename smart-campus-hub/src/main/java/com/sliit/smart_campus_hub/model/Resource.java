package com.sliit.smart_campus_hub.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Resource model for Module A - Facilities & Assets Catalogue
 * This is a placeholder for the resource model that will be fully implemented by another member.
 * Incident tickets can be linked to specific resources.
 */
@Document(collection = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    
    private ResourceType type;
    private String location;
    private Integer capacity;
    private String description;
    private ResourceStatus status;
    
    private Date createdAt;
    private Date updatedAt;
    
    // Availability windows (placeholder for future implementation)
    private String availabilityInfo;
    
    public enum ResourceType {
        LECTURE_HALL,
        LAB,
        MEETING_ROOM,
        PROJECTOR,
        CAMERA,
        EQUIPMENT,
        OTHER
    }
    
    public enum ResourceStatus {
        ACTIVE,
        OUT_OF_SERVICE,
        MAINTENANCE
    }
}
