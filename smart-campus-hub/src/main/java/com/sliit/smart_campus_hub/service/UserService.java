package com.sliit.smart_campus_hub.service;

import java.util.Optional;

import com.sliit.smart_campus_hub.model.User;

public interface UserService {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    User saveUser(User user);
    
    Optional<User> findById(String id);
}