package com.sliit.smart_campus_hub;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.server.PortInUseException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class SmartCampusHubApplication {
    private static final Logger logger = LoggerFactory.getLogger(SmartCampusHubApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SmartCampusHubApplication.class);
        try {
            app.run(args);
        } catch (Exception ex) {
            if (isPortInUse(ex)) {
                logger.warn("Configured port is in use. Retrying application startup on a random free port.");
                System.setProperty("server.port", "0");
                SpringApplication fallbackApp = new SpringApplication(SmartCampusHubApplication.class);
                fallbackApp.setDefaultProperties(Map.of("server.port", "0"));
                fallbackApp.run(args);
                return;
            }
            throw ex;
        }
    }

    private static boolean isPortInUse(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof PortInUseException) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}