package com.sliit.smart_campus_hub.service.impl;

import com.sliit.smart_campus_hub.dto.ResourceRequest;
import com.sliit.smart_campus_hub.dto.ResourceResponse;
import com.sliit.smart_campus_hub.enums.ResourceStatus;
import com.sliit.smart_campus_hub.enums.ResourceType;
import com.sliit.smart_campus_hub.model.Resource;
import com.sliit.smart_campus_hub.repository.ResourceRepository;
import com.sliit.smart_campus_hub.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponse createResource(ResourceRequest request) {
        validateTime(request);

        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .status(request.getStatus())
                .description(request.getDescription())
                .build();

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ResourceResponse getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        return mapToResponse(resource);
    }

    @Override
    public ResourceResponse updateResource(String id, ResourceRequest request) {
        validateTime(request);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(request.getStatus());
        resource.setDescription(request.getDescription());

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    public List<ResourceResponse> searchResources(String keyword, String type, String status, String location, Integer minCapacity) {
        List<Resource> resources = resourceRepository.findAll();

        return resources.stream()
                .filter(r -> keyword == null || r.getName().toLowerCase().contains(keyword.toLowerCase()))
                .filter(r -> type == null || r.getType().equals(ResourceType.valueOf(type)))
                .filter(r -> status == null || r.getStatus().equals(ResourceStatus.valueOf(status)))
                .filter(r -> location == null || r.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(r -> minCapacity == null || r.getCapacity() >= minCapacity)
                .map(this::mapToResponse)
                .toList();
    }

    private void validateTime(ResourceRequest request) {
        if (request.getAvailableFrom() != null &&
                request.getAvailableTo() != null &&
                !request.getAvailableFrom().isBefore(request.getAvailableTo())) {
            throw new RuntimeException("Available from time must be before available to time");
        }
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .build();
    }
}