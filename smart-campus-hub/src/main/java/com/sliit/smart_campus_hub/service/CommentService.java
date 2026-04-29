package com.sliit.smart_campus_hub.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.model.Comment;
import com.sliit.smart_campus_hub.repository.CommentRepository;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    public Comment createComment(String ticketId, String userId, String content) {
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .userId(userId)
                .content(content)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
        
        return commentRepository.save(comment);
    }
    
    public List<Comment> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }
    
    public Comment getCommentById(String id) {
        return commentRepository.findById(id).orElse(null);
    }
    
    public Comment updateComment(String id, String userId, String content) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return null;
        }
        
        // Only the comment owner can edit
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own comments");
        }
        
        comment.setContent(content);
        comment.setUpdatedAt(new Date());
        
        return commentRepository.save(comment);
    }
    
    public boolean deleteComment(String id, String userId, String userRole) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return false;
        }
        
        // Only the comment owner or admin can delete
        if (!comment.getUserId().equals(userId) && !userRole.equals("ADMIN")) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.deleteById(id);
        return true;
    }
}
