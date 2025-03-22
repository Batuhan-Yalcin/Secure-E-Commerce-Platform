package com.batuhanyalcin.SecureECommercePlatform;

import com.batuhanyalcin.dto.UserDTO;
import com.batuhanyalcin.dto.auth.RegisterRequestDTO;
import com.batuhanyalcin.exception.ResourceNotFoundException;
import com.batuhanyalcin.model.User;
import com.batuhanyalcin.repository.UserRepository;
import com.batuhanyalcin.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private RegisterRequestDTO registerRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("unittest");
        testUser.setEmail("unit@test.com");
        testUser.setPassword("pass1234");
        System.out.println("Username : " + testUser.getUsername());
        System.out.println("email : " + testUser.getEmail());
        System.out.println("pass : " + testUser.getPassword());
        
        registerRequest = new RegisterRequestDTO();
        registerRequest.setUsername("newUser");
        registerRequest.setEmail("new@test.com");
        registerRequest.setPassword("password123");
        
        System.out.println("reqisterRequest Username : " + registerRequest.getUsername());
        System.out.println("reqisterRequest email : " + registerRequest.getEmail());
        System.out.println("reqisterRequest pass : " + registerRequest.getPassword());
    }

    @Test
    void createUser_Success() {
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.createUser(testUser);
        System.out.println("create user : " + result);

        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(passwordEncoder).encode(any());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDTO result = userService.getUserById(1L);
        
        System.out.println("yakalanan id : " + result);

        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());
    }

    @Test
    void getUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(1L);
        });
    }

    @Test
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

        List<UserDTO> results = userService.getAllUsers();
        
        System.out.println("find user's : " + results);

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }

    @Test
    void createUserFromRequest_Success() {
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<?> response = userService.createUserFromRequest(registerRequest);

        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository).save(any(User.class));
    }
} 