package com.sliit.smart_campus_hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.enums.EventType;
import com.sliit.smart_campus_hub.model.Notification;
import com.sliit.smart_campus_hub.service.NotificationService;
import com.sliit.smart_campus_hub.service.UserService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    private String getUserId(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // Get all notifications for the authenticated user
    @GetMapping
    public ResponseEntity<?> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        long count = notificationService.countUnread(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Unread count", count));
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            notificationService.markAsRead(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Marked as read"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Delete a notification (user can only delete their own)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            notificationService.delete(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ----------------------------------------------------------------------
    // TEMPORARY TEST ENDPOINT – Remove before production!
    // Creates a notification for the authenticated user with given message and event type.
    // Example: POST /api/notifications/test/create?message=Hello&eventType=SYSTEM
    // ----------------------------------------------------------------------
    @PostMapping("/test/create")
    public ResponseEntity<?> testCreate(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestParam String message,
                                        @RequestParam(defaultValue = "SYSTEM") String eventType) {
        String userId = getUserId(userDetails);
        EventType type;
        try {
            type = EventType.valueOf(eventType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false,
                    "Invalid event type. Allowed: " + java.util.Arrays.toString(EventType.values())));
        }
        Notification notif = notificationService.create(userId, message, type);
        return ResponseEntity.ok(notif);
    }
}