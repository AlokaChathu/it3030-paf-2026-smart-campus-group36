package com.sliit.smart_campus_hub.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.model.Attachment;
import com.sliit.smart_campus_hub.repository.AttachmentRepository;

@Service
public class AttachmentService {
    
    @Autowired
    private AttachmentRepository attachmentRepository;
    
    private static final int MAX_ATTACHMENTS_PER_TICKET = 3;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    public Attachment createAttachment(String ticketId, String fileName, String fileType, 
                                      long fileSize, String fileData, String uploadedBy) {
        // Check if ticket already has max attachments
        long currentCount = attachmentRepository.countByTicketId(ticketId);
        if (currentCount >= MAX_ATTACHMENTS_PER_TICKET) {
            throw new RuntimeException("Maximum of " + MAX_ATTACHMENTS_PER_TICKET + " attachments allowed per ticket");
        }
        
        // Check file size
        if (fileSize > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 5MB");
        }
        
        // Check if file is an image
        if (!fileType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }
        
        Attachment attachment = Attachment.builder()
                .ticketId(ticketId)
                .fileName(fileName)
                .fileType(fileType)
                .fileSize(fileSize)
                .fileData(fileData)
                .uploadedBy(uploadedBy)
                .uploadedAt(new Date())
                .build();
        
        return attachmentRepository.save(attachment);
    }
    
    public List<Attachment> getAttachmentsByTicketId(String ticketId) {
        return attachmentRepository.findByTicketId(ticketId);
    }
    
    public Attachment getAttachmentById(String id) {
        return attachmentRepository.findById(id).orElse(null);
    }
    
    public boolean deleteAttachment(String id, String userId) {
        Attachment attachment = attachmentRepository.findById(id).orElse(null);
        if (attachment == null) {
            return false;
        }
        
        // Only the uploader or admin can delete
        if (!attachment.getUploadedBy().equals(userId)) {
            throw new RuntimeException("You can only delete your own attachments");
        }
        
        attachmentRepository.deleteById(id);
        return true;
    }
    
    public long getAttachmentCount(String ticketId) {
        return attachmentRepository.countByTicketId(ticketId);
    }
}
