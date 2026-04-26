package com.sliit.smart_campus_hub.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sliit.smart_campus_hub.enums.TicketStatus;
import com.sliit.smart_campus_hub.model.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    List<Ticket> findByCreatedBy(String userId);
    
    List<Ticket> findByAssignedTo(String technicianId);
    
    List<Ticket> findByStatus(TicketStatus status);
    
    @Query("{'createdBy': ?0, 'status': ?1}")
    List<Ticket> findByCreatedByAndStatus(String userId, TicketStatus status);
    
    @Query("{'assignedTo': ?0, 'status': ?1}")
    List<Ticket> findByAssignedToAndStatus(String technicianId, TicketStatus status);
    
    List<Ticket> findByResourceId(String resourceId);
    
    List<Ticket> findByCreatedAtAfterOrderByCreatedAtAsc(Date date);
    
    @Query("{'rating': {$ne: null}, 'createdAt': {$gte: ?0}}")
    List<Ticket> findByRatingNotNullAndCreatedAtAfter(Date date);
}
