package com.batuhanyalcin.controller;

import com.batuhanyalcin.model.User;
import com.batuhanyalcin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{username}")
    public String checkUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElse(null);
        
        if (user == null) {
            return "Kullanıcı bulunamadı";
        }
        
        return String.format(
            "Kullanıcı bulundu:\nID: %d\nUsername: %s\nEmail: %s\nRoller: %s",
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRoles()
        );
    }
} 