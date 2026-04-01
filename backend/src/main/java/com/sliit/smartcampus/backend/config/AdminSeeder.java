package com.sliit.smartcampus.backend.config;

import com.sliit.smartcampus.backend.model.Role;
import com.sliit.smartcampus.backend.model.User;
import com.sliit.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(adminEmail);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                userRepository.save(user);
                log.info("System Boot: Automatically promoted {} to ADMIN role.", adminEmail);
            }
        } else {
            log.info("System Boot: Super admin email {} not found in database yet. Log in via Google first!", adminEmail);
        }
    }
}