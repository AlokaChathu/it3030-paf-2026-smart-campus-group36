package com.sliit.smart_campus_hub.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sliit.smart_campus_hub.model.Attachment;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    
    List<Attachment> findByTicketId(String ticketId);
    
    long countByTicketId(String ticketId);
}
