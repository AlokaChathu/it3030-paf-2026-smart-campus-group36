package com.sliit.smartcampus.backend.service;

import com.sliit.smartcampus.backend.dto.ResourceRequest;
import com.sliit.smartcampus.backend.model.Resource;
import com.sliit.smartcampus.backend.model.ResourceStatus;
import com.sliit.smartcampus.backend.model.ResourceType;
import com.sliit.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    // Create a new resource
    public Resource createResource(ResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .status(ResourceStatus.ACTIVE) // Default to active
                .build();
        
        return resourceRepository.save(resource);
    }

    // Get all resources with optional filtering
    public List<Resource> getResources(ResourceType type, Integer minCapacity, String location) {
        if (type != null) {
            return resourceRepository.findByType(type);
        } else if (minCapacity != null) {
            return resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        } else if (location != null && !location.isEmpty()) {
            return resourceRepository.findByLocationContainingIgnoreCase(location);
        }
        
        // If no filters are provided, return all
        return resourceRepository.findAll();
    }

    // Update resource status (e.g., mark as OUT_OF_SERVICE)
    public Resource updateResourceStatus(Long id, ResourceStatus newStatus) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        
        resource.setStatus(newStatus);
        return resourceRepository.save(resource);
    }

    // Delete a resource
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}