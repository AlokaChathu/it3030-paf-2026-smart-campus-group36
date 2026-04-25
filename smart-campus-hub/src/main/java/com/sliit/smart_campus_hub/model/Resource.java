package com.sliit.smart_campus_hub.model;

import com.sliit.smart_campus_hub.enums.ResourceStatus;
import com.sliit.smart_campus_hub.enums.ResourceType;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotNull
    private ResourceType type;

    @Min(1)
    private int capacity;

    @NotBlank
    private String location;

    @NotNull
    private LocalTime availableFrom;

    @NotNull
    private LocalTime availableTo;

    @NotNull
    private ResourceStatus status;

    private String description;
}