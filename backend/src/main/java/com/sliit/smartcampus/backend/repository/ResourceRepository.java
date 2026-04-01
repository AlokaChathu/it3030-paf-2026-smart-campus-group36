package com.sliit.smartcampus.backend.repository;

import com.sliit.smartcampus.backend.model.Resource;
import com.sliit.smartcampus.backend.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    // Custom query methods for the filtering requirements
    List<Resource> findByType(ResourceType type);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
}