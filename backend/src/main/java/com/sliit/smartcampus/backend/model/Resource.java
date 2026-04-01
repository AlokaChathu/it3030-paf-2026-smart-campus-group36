package com.sliit.smartcampus.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Mini Auditorium", "Dell Projector 01"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    // Capacity can be null for equipment like projectors
    private Integer capacity;

    private String location; // e.g., "Building A, Floor 3"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;
}