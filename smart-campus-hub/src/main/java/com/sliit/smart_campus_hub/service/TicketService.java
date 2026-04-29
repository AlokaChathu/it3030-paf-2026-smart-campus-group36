package com.sliit.smart_campus_hub.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.enums.TicketStatus;
import com.sliit.smart_campus_hub.model.Ticket;
import com.sliit.smart_campus_hub.repository.TicketRepository;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    public Ticket createTicket(Ticket ticket) {
        ticket.setCreatedAt(new Date());
        ticket.setUpdatedAt(new Date());
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }
    
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }
    
    public List<Ticket> getTicketsByUserId(String userId) {
        return ticketRepository.findByCreatedBy(userId);
    }
    
    public List<Ticket> getTicketsAssignedTo(String technicianId) {
        return ticketRepository.findByAssignedTo(technicianId);
    }
    
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }
    
    public Ticket updateTicket(String id, Ticket ticketDetails) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return null;
        }
        
        Ticket ticket = ticketOpt.get();
        ticket.setTitle(ticketDetails.getTitle());
        ticket.setDescription(ticketDetails.getDescription());
        ticket.setCategory(ticketDetails.getCategory());
        ticket.setPriority(ticketDetails.getPriority());
        ticket.setLocation(ticketDetails.getLocation());
        ticket.setContactDetails(ticketDetails.getContactDetails());
        ticket.setResourceId(ticketDetails.getResourceId());
        ticket.setUpdatedAt(new Date());
        
        return ticketRepository.save(ticket);
    }
    
    public Ticket updateTicketStatus(String id, TicketStatus status, String rejectionReason) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return null;
        }
        
        Ticket ticket = ticketOpt.get();
        TicketStatus currentStatus = ticket.getStatus();
        
        // Validate status workflow
        if (!isValidStatusTransition(currentStatus, status)) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + status);
        }
        
        ticket.setStatus(status);
        ticket.setUpdatedAt(new Date());
        if (rejectionReason != null) {
            ticket.setRejectionReason(rejectionReason);
        }
        
        return ticketRepository.save(ticket);
    }
    
    private boolean isValidStatusTransition(TicketStatus from, TicketStatus to) {
        // OPEN can go to IN_PROGRESS, REJECTED
        // IN_PROGRESS can go to RESOLVED, REJECTED
        // RESOLVED can go to CLOSED or back to IN_PROGRESS
        // REJECTED and CLOSED are final states
        
        if (from == TicketStatus.OPEN) {
            return to == TicketStatus.IN_PROGRESS || to == TicketStatus.REJECTED;
        }
        if (from == TicketStatus.IN_PROGRESS) {
            return to == TicketStatus.RESOLVED || to == TicketStatus.REJECTED;
        }
        if (from == TicketStatus.RESOLVED) {
            return to == TicketStatus.CLOSED || to == TicketStatus.IN_PROGRESS;
        }
        if (from == TicketStatus.REJECTED || from == TicketStatus.CLOSED) {
            return false;
        }
        
        return false;
    }
    
    public Ticket assignTechnician(String id, String technicianId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return null;
        }
        
        Ticket ticket = ticketOpt.get();
        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(new Date());
        
        return ticketRepository.save(ticket);
    }
    
    public boolean deleteTicket(String id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Ticket rateTicket(String id, Integer rating, String ratedBy) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return null;
        }
        
        Ticket ticket = ticketOpt.get();
        ticket.setRating(rating);
        ticket.setRatedBy(ratedBy);
        ticket.setRatedAt(new Date());
        ticket.setUpdatedAt(new Date());
        
        return ticketRepository.save(ticket);
    }
}
