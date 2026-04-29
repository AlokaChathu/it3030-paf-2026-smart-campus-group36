package com.sliit.smart_campus_hub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.sliit.smart_campus_hub.enums.Role;
import com.sliit.smart_campus_hub.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String token);

    List<User> findByRole(Role role);
}