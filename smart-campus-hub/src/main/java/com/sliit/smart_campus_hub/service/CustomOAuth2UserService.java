package com.sliit.smart_campus_hub.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.config.CustomOAuth2User;
import com.sliit.smart_campus_hub.enums.AuthProvider;
import com.sliit.smart_campus_hub.enums.Role;
import com.sliit.smart_campus_hub.model.User;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        Optional<User> existingUser = userService.findByEmail(email);
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            if (user.getProvider() != AuthProvider.GOOGLE) {
                user.setProvider(AuthProvider.GOOGLE);
                userService.saveUser(user);
            }
        } else {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .role(Role.USER)
                    .provider(AuthProvider.GOOGLE)
                    .emailVerified(true)
                    .createdAt(new java.util.Date())
                    .updatedAt(new java.util.Date())
                    .build();
            userService.saveUser(user);
        }
        
        return new CustomOAuth2User(oAuth2User, user);
    }
}