package com.sliit.smartcampus.backend.controller;

import com.sliit.smartcampus.backend.dto.ResourceRequest;
import com.sliit.smartcampus.backend.model.Resource;
import com.sliit.smartcampus.backend.model.ResourceStatus;
import com.sliit.smartcampus.backend.model.ResourceType;
import com.sliit.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // Create a resource (ADMIN only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceRequest request) {
        Resource createdResource = resourceService.createResource(request);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    // Get resources with optional filters (Accessible to any logged-in user)
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {
        
        List<Resource> resources = resourceService.getResources(type, minCapacity, location);
        return ResponseEntity.ok(resources);
    }

    // Update resource status (ADMIN only)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateStatus(
            @PathVariable Long id, 
            @RequestParam ResourceStatus status) {
        
        Resource updatedResource = resourceService.updateResourceStatus(id, status);
        return ResponseEntity.ok(updatedResource);
    }

    // Delete a resource (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}