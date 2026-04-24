package com.sliit.smart_campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;   // can be validation errors or any extra info

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}