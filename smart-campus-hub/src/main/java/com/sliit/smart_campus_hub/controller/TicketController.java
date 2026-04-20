package com.sliit.smart_campus_hub.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.dto.AssignTechnicianRequest;
import com.sliit.smart_campus_hub.dto.CreateTicketRequest;
import com.sliit.smart_campus_hub.dto.UpdateStatusRequest;
import com.sliit.smart_campus_hub.dto.UpdateTicketRequest;
import com.sliit.smart_campus_hub.enums.TicketStatus;
import com.sliit.smart_campus_hub.enums.EventType;
import com.sliit.smart_campus_hub.model.Ticket;
import com.sliit.smart_campus_hub.service.NotificationService;
import com.sliit.smart_campus_hub.service.TicketService;
import com.sliit.smart_campus_hub.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    private String getUserId(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // Create ticket - authenticated users
    @PostMapping
    public ResponseEntity<?> createTicket(@Valid @RequestBody CreateTicketRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            Ticket ticket = Ticket.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .category(request.getCategory())
                    .priority(request.getPriority())
                    .resourceId(request.getResourceId())
                    .location(request.getLocation())
                    .contactDetails(request.getContactDetails())
                    .createdBy(userId)
                    .build();
            
            Ticket createdTicket = ticketService.createTicket(ticket);
            return ResponseEntity.ok(createdTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get all tickets - ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get current user's tickets
    @GetMapping("/my")
    public ResponseEntity<?> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            List<Ticket> tickets = ticketService.getTicketsByUserId(userId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get tickets assigned to current technician
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<?> getAssignedTickets(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            List<Ticket> tickets = ticketService.getTicketsAssignedTo(userId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get ticket by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket ticket = ticketOpt.get();
            String userId = getUserId(userDetails);
            
            // Check if user is owner, assigned technician, or admin
            if (!ticket.getCreatedBy().equals(userId) && 
                !userId.equals(ticket.getAssignedTo()) &&
                !userService.getUserRole(userId).equals("ADMIN")) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Access denied"));
            }
            
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Update ticket - owner or ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable String id,
                                         @Valid @RequestBody UpdateTicketRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket existingTicket = ticketOpt.get();
            String userId = getUserId(userDetails);
            
            // Only owner or ADMIN can update
            if (!existingTicket.getCreatedBy().equals(userId) && 
                !userService.getUserRole(userId).equals("ADMIN")) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Access denied"));
            }
            
            Ticket ticketDetails = Ticket.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .category(request.getCategory())
                    .priority(request.getPriority())
                    .resourceId(request.getResourceId())
                    .location(request.getLocation())
                    .contactDetails(request.getContactDetails())
                    .build();
            
            Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
            return ResponseEntity.ok(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Update ticket status - TECHNICIAN or ADMIN
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    public ResponseEntity<?> updateTicketStatus(@PathVariable String id,
                                               @Valid @RequestBody UpdateStatusRequest request,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket ticket = ticketOpt.get();
            String userId = getUserId(userDetails);
            String userRole = userService.getUserRole(userId);
            
            // Only assigned technician or ADMIN can update status
            if (!userId.equals(ticket.getAssignedTo()) && !userRole.equals("ADMIN")) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Access denied"));
            }
            
            // Validate rejection reason
            if (request.getStatus() == TicketStatus.REJECTED && 
                (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Rejection reason is required"));
            }
            
            // Only ADMIN can reject tickets
            if (request.getStatus() == TicketStatus.REJECTED && !userRole.equals("ADMIN")) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Only ADMIN can reject tickets"));
            }
            
            Ticket updatedTicket = ticketService.updateTicketStatus(id, request.getStatus(), request.getRejectionReason());
            
            // Trigger notification to ticket owner
            notificationService.create(
                    updatedTicket.getCreatedBy(),
                    "Ticket #" + updatedTicket.getId().substring(0, 8) + " status changed to " + request.getStatus(),
                    EventType.TICKET_STATUS
            );
            
            // If technician is assigned, also notify them
            if (updatedTicket.getAssignedTo() != null && !updatedTicket.getAssignedTo().equals(updatedTicket.getCreatedBy())) {
                notificationService.create(
                        updatedTicket.getAssignedTo(),
                        "Assigned ticket #" + updatedTicket.getId().substring(0, 8) + " status changed to " + request.getStatus(),
                        EventType.TICKET_STATUS
                );
            }
            
            return ResponseEntity.ok(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Assign technician - ADMIN only
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTechnician(@PathVariable String id,
                                             @Valid @RequestBody AssignTechnicianRequest request) {
        try {
            Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket updatedTicket = ticketService.assignTechnician(id, request.getTechnicianId());
            
            // Trigger notification to assigned technician
            notificationService.create(
                    request.getTechnicianId(),
                    "You have been assigned to ticket #" + updatedTicket.getId().substring(0, 8),
                    EventType.TICKET_STATUS
            );
            
            // Trigger notification to ticket owner
            notificationService.create(
                    updatedTicket.getCreatedBy(),
                    "Ticket #" + updatedTicket.getId().substring(0, 8) + " has been assigned to a technician",
                    EventType.TICKET_STATUS
            );
            
            return ResponseEntity.ok(updatedTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Delete ticket - owner or ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
            if (ticketOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Ticket ticket = ticketOpt.get();
            String userId = getUserId(userDetails);
            
            // Only owner or ADMIN can delete
            if (!ticket.getCreatedBy().equals(userId) && 
                !userService.getUserRole(userId).equals("ADMIN")) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Access denied"));
            }
            
            boolean deleted = ticketService.deleteTicket(id);
            if (deleted) {
                return ResponseEntity.ok(new ApiResponse(true, "Ticket deleted successfully"));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to delete ticket"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
