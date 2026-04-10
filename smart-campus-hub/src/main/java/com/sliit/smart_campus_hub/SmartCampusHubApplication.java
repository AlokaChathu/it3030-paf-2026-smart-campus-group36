package com.sliit.smart_campus_hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class SmartCampusHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusHubApplication.class, args);
    }
}