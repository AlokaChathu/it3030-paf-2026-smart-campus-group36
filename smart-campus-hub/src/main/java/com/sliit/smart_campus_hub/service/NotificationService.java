package com.sliit.smart_campus_hub.service;

import java.util.List;

import com.sliit.smart_campus_hub.enums.EventType;
import com.sliit.smart_campus_hub.model.Notification;

public interface NotificationService {
    // Create with eventType (required) and message
    Notification create(String userId, String message, EventType eventType);
    
    // Overload: default eventType = SYSTEM
    default Notification create(String userId, String message) {
        return create(userId, message, EventType.SYSTEM);
    }
    
    List<Notification> getUserNotifications(String userId);
    Notification markAsRead(String notificationId, String userId);
    void delete(String notificationId, String userId);
    long countUnread(String userId);
    
    // Admin methods
    List<Notification> getAllNotifications();
    void adminDelete(String notificationId);
}