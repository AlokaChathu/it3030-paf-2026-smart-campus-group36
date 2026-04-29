package com.sliit.smart_campus_hub.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "attachments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
    
    @Id
    private String id;
    
    @Indexed
    private String ticketId;  // Reference to the ticket
    
    private String fileName;
    private String fileType;  // e.g., "image/jpeg", "image/png"
    private long fileSize;    // File size in bytes
    
    private String fileData;  // Base64 encoded image data
    
    @Indexed
    private String uploadedBy;  // User ID who uploaded the attachment
    
    private Date uploadedAt;
}
