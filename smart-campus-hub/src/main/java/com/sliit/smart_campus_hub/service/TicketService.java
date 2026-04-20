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
        ticket.setStatus(status);
        ticket.setUpdatedAt(new Date());
        if (rejectionReason != null) {
            ticket.setRejectionReason(rejectionReason);
        }
        
        return ticketRepository.save(ticket);
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
}
