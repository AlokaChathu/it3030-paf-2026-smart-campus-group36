package com.sliit.smart_campus_hub.dto;

import com.sliit.smart_campus_hub.enums.ResourceStatus;
import com.sliit.smart_campus_hub.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class ResourceResponse {
    private String id;
    private String name;
    private ResourceType type;
    private int capacity;
    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String description;
}