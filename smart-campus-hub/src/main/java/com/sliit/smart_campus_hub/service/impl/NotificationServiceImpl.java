package com.sliit.smart_campus_hub.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.enums.EventType;
import com.sliit.smart_campus_hub.model.Notification;
import com.sliit.smart_campus_hub.repository.NotificationRepository;
import com.sliit.smart_campus_hub.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification create(String userId, String message, EventType eventType) {
        Notification notif = Notification.builder()
                .userId(userId)
                .message(message)
                .eventType(eventType != null ? eventType.name() : EventType.SYSTEM.name())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notif);
    }

    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(String notificationId, String userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notif.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    @Override
    public void delete(String notificationId, String userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notif.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        notificationRepository.deleteById(notificationId);
    }

    @Override
    public long countUnread(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId).size();
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public void adminDelete(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}