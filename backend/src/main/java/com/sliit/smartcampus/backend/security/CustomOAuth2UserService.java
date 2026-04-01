package com.sliit.smartcampus.backend.security;

import com.sliit.smartcampus.backend.model.Role;
import com.sliit.smartcampus.backend.model.User;
import com.sliit.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j // Added for logging
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("--- Google OAuth2 Login Triggered ---"); // Debug log

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        log.info("Extracted Email: {}", email); // Debug log
        log.info("Extracted Name: {}", name);   // Debug log

        // Register user if they are logging in for the first time
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            log.info("User not found in database. Attempting to save new user..."); // Debug log
            
            try {
                User user = User.builder()
                        .email(email)
                        .name(name != null ? name : "Unknown User")
                        .role(Role.USER) // Default role assignment
                        .build();
                userRepository.save(user);
                log.info("Successfully saved user to database!"); // Debug log
            } catch (Exception e) {
                log.error("Failed to save user to database: ", e); // Catch and print any silent SQL errors
            }
        } else {
            log.info("User already exists in the database. Skipping save."); // Debug log
        }

        return oAuth2User;
    }
}