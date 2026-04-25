package com.sliit.smart_campus_hub.service;

import com.sliit.smart_campus_hub.dto.ResourceRequest;
import com.sliit.smart_campus_hub.dto.ResourceResponse;

import java.util.List;

public interface ResourceService {

    ResourceResponse createResource(ResourceRequest request);

    List<ResourceResponse> getAllResources();

    ResourceResponse getResourceById(String id);

    ResourceResponse updateResource(String id, ResourceRequest request);

    void deleteResource(String id);

    List<ResourceResponse> searchResources(String keyword, String type, String status, String location, Integer minCapacity);
}