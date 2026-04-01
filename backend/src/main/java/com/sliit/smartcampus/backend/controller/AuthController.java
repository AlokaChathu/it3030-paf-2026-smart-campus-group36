package com.sliit.smartcampus.backend.controller;

import com.sliit.smartcampus.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class AuthController { // You can rename this class to UserController

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        // The @AuthenticationPrincipal now automatically injects our database User object
        // because we set it in the JwtAuthenticationFilter!
        return ResponseEntity.ok(currentUser);
    }
}