package com.sliit.smart_campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String userId;
    private String email;
    private String role;
}