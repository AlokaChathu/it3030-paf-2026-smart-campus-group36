package com.sliit.smart_campus_hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.model.Attachment;
import com.sliit.smart_campus_hub.service.AttachmentService;
import com.sliit.smart_campus_hub.service.UserService;

@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    private UserService userService;

    private String getUserId(UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // Upload attachment
    @PostMapping
    public ResponseEntity<?> uploadAttachment(@PathVariable String ticketId,
                                            @RequestBody AttachmentUploadRequest request,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            Attachment attachment = attachmentService.createAttachment(
                    ticketId,
                    request.getFileName(),
                    request.getFileType(),
                    request.getFileSize(),
                    request.getFileData(),
                    userId
            );
            return ResponseEntity.ok(attachment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get all attachments for a ticket
    @GetMapping
    public ResponseEntity<?> getAttachments(@PathVariable String ticketId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<Attachment> attachments = attachmentService.getAttachmentsByTicketId(ticketId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Get attachment by ID
    @GetMapping("/attachment/{attachmentId}")
    public ResponseEntity<?> getAttachment(@PathVariable String ticketId,
                                        @PathVariable String attachmentId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Attachment attachment = attachmentService.getAttachmentById(attachmentId);
            if (attachment == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(attachment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Delete attachment
    @DeleteMapping("/attachment/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable String ticketId,
                                            @PathVariable String attachmentId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = getUserId(userDetails);
            boolean deleted = attachmentService.deleteAttachment(attachmentId, userId);
            if (deleted) {
                return ResponseEntity.ok(new ApiResponse(true, "Attachment deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // DTO for attachment upload
    public static class AttachmentUploadRequest {
        private String fileName;
        private String fileType;
        private long fileSize;
        private String fileData; // Base64 encoded

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public long getFileSize() { return fileSize; }
        public void setFileSize(long fileSize) { this.fileSize = fileSize; }
        public String getFileData() { return fileData; }
        public void setFileData(String fileData) { this.fileData = fileData; }
    }
}
