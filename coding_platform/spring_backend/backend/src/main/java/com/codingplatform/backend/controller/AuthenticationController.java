package com.codingplatform.backend.controller;

import com.codingplatform.backend.model.User;
import com.codingplatform.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return Map.of("success", false, "error", "Invalid email or password");
        }

        User user = userOpt.get();

        // For now just check if password matches "password123"
        // When we add proper auth later we'll use bcrypt here
        if (!password.equals("password123")) {
            return Map.of("success", false, "error", "Invalid email or password");
        }

        return Map.of(
                "success", true,
                "userId", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }
}
