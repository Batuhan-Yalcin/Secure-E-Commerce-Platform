package com.batuhanyalcin.service;

import com.batuhanyalcin.dto.*;
import com.batuhanyalcin.dto.auth.RegisterRequestDTO;
import com.batuhanyalcin.dto.user.ProfileUpdateDTO;
import com.batuhanyalcin.model.*;
import com.batuhanyalcin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.batuhanyalcin.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Collections;
import org.springframework.security.authentication.BadCredentialsException;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public Long getUserCount() {
        return userRepository.count();
    }

    @Transactional
    public UserDTO updateProfile(Long userId, ProfileUpdateDTO profileUpdateDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));
        
        // Email değişikliği varsa ve yeni email başka bir kullanıcıda varsa hata ver
        if (profileUpdateDTO.getEmail() != null && 
            !profileUpdateDTO.getEmail().equals(user.getEmail()) && 
            existsByEmail(profileUpdateDTO.getEmail())) {
            
            throw new EmailAlreadyExistsException("Bu email zaten kullanımda: " + profileUpdateDTO.getEmail());
        }
        
        if (profileUpdateDTO.getEmail() != null) {
            user.setEmail(profileUpdateDTO.getEmail());
        }
        
        user.setFirstName(profileUpdateDTO.getFirstName());
        user.setLastName(profileUpdateDTO.getLastName());
        user.setPhoneNumber(profileUpdateDTO.getPhoneNumber());
        user.setAddress(profileUpdateDTO.getAddress());
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    @Transactional
    public ResponseEntity<?> changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));
        
        // Mevcut şifreyi doğrula
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadCredentialsException("Mevcut şifre hatalı");
        }
        
        // Yeni şifreyi kaydet
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok("Şifre başarıyla değiştirildi");
    }
    
    @Transactional
    public ResponseEntity<?> deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + userId));
        
        userRepository.delete(user);
        return ResponseEntity.ok("Kullanıcı başarıyla silindi");
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        return dto;
    }

    @Transactional
    public ResponseEntity<?> createUserFromRequest(RegisterRequestDTO registerRequest) {
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRoles(Collections.singleton("ROLE_USER")); 

            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi");
        } catch (Exception e) {
            logger.error("Kullanıcı kaydı sırasında hata: ", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Kayıt işlemi sırasında bir hata oluştu");
        }
    }
} 