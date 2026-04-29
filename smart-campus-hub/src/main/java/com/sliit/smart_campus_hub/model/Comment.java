package com.sliit.smart_campus_hub.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    
    @Id
    private String id;
    
    @Indexed
    private String ticketId;  // Reference to the ticket
    
    @Indexed
    private String userId;    // User who created the comment
    
    private String content;
    
    private Date createdAt;
    private Date updatedAt;
}
