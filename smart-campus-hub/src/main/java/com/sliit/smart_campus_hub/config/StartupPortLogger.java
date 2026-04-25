package com.sliit.smart_campus_hub.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class StartupPortLogger implements ApplicationListener<WebServerInitializedEvent> {

    private static final Logger logger = LoggerFactory.getLogger(StartupPortLogger.class);

    @Override
    public void onApplicationEvent(WebServerInitializedEvent event) {
        logger.info("Smart Campus Hub is running on port: {}", event.getWebServer().getPort());
    }
}
