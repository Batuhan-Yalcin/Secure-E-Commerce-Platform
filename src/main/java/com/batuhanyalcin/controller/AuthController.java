package com.batuhanyalcin.controller;

import com.batuhanyalcin.dto.auth.AuthResponseDTO;
import com.batuhanyalcin.dto.auth.LoginRequestDTO;
import com.batuhanyalcin.dto.auth.RegisterRequestDTO;
import com.batuhanyalcin.security.CustomUserDetailsService;
import com.batuhanyalcin.security.JwtUtils;
import com.batuhanyalcin.security.UserPrincipal;
import com.batuhanyalcin.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        logger.info("Login isteği alındı - username: {}", loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            return ResponseEntity.ok(new AuthResponseDTO(
                jwt,
                "Bearer",
                userPrincipal.getUsername(),
                userPrincipal.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ROLE_USER")
            ));
        } catch (AuthenticationException e) {
            logger.error("Login hatası: {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Hatalı kullanıcı adı veya şifre");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        // Mevcut register metodu
        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                .badRequest()
                .body("Hata: Bu kullanıcı adı zaten kullanımda!");
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                .badRequest()
                .body("Hata: Bu email zaten kullanımda!");
        }

        // Yeni kullanıcı oluştur
        return userService.createUserFromRequest(registerRequest);
    }
    
    @GetMapping("/check-token")
    public ResponseEntity<?> checkToken() {
        // Bu endpoint'e sadece geçerli bir token ile erişilebilir
        // Eğer token geçersizse, SecurityConfig zaten 401 hatası döndürecek
        logger.info("Token doğrulama isteği alındı");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok("Token geçerli");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Geçersiz token");
        }
    }
} 