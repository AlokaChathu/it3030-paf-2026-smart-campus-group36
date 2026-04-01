package com.sliit.smartcampus.backend.dto;

import com.sliit.smartcampus.backend.model.ResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRequest {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private Integer capacity;

    private String location;
}