package com.sliit.smart_campus_hub.repository;

import com.sliit.smart_campus_hub.enums.ResourceStatus;
import com.sliit.smart_campus_hub.enums.ResourceType;
import com.sliit.smart_campus_hub.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByNameContainingIgnoreCase(String name);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);
}