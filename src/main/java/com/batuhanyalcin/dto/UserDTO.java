package com.batuhanyalcin.dto;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
} 