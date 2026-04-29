package com.sliit.smart_campus_hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.dto.CommentRequest;
import com.sliit.smart_campus_hub.enums.EventType;
import com.sliit.smart_campus_hub.model.Comment;
import com.sliit.smart_campus_hub.model.Ticket;
import com.sliit.smart_campus_hub.service.CommentService;
import com.sliit.smart_campus_hub.service.NotificationService;
import com.sliit.smart_campus_hub.service.TicketService;
import com.sliit.smart_campus_hub.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TicketService ticketService;

    private String getUserId(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // Add comment
    @PostMapping
    public ResponseEntity<?> addComment(@PathVariable String ticketId,
                                      @Valid @RequestBody CommentRequest request,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            Comment comment = commentService.createComment(ticketId, userId, request.getContent());
            
            // Get ticket to notify owner
            Ticket ticket = ticketService.getTicketById(ticketId).orElse(null);
            if (ticket != null) {
                // Notify ticket owner (if not the commenter)
                if (!ticket.getCreatedBy().equals(userId)) {
                    notificationService.create(
                            ticket.getCreatedBy(),
                            "New comment added to ticket #" + ticketId.substring(0, 8),
                            EventType.COMMENT
                    );
                }
                // Notify assigned technician (if exists and not the commenter)
                if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(userId)) {
                    notificationService.create(
                            ticket.getAssignedTo(),
                            "New comment added to ticket #" + ticketId.substring(0, 8),
                            EventType.COMMENT
                    );
                }
            }
            
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get all comments for a ticket
    @GetMapping
    public ResponseEntity<?> getComments(@PathVariable String ticketId,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<Comment> comments = commentService.getCommentsByTicketId(ticketId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Update comment
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String ticketId,
                                        @PathVariable String commentId,
                                        @Valid @RequestBody CommentRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            Comment comment = commentService.updateComment(commentId, userId, request.getContent());
            if (comment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Delete comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String ticketId,
                                        @PathVariable String commentId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            String userRole = userService.getUserRole(userId);
            boolean deleted = commentService.deleteComment(commentId, userId, userRole);
            if (deleted) {
                return ResponseEntity.ok(new ApiResponse(true, "Comment deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
