package com.sliit.smart_campus_hub.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String address;
    private Integer age;
    private String phoneNumber;
}