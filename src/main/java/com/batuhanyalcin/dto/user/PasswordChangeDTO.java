package com.batuhanyalcin.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordChangeDTO {
    @NotBlank(message = "Mevcut şifre boş olamaz")
    private String currentPassword;
    
    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 6, message = "Yeni şifre en az 6 karakter olmalıdır")
    private String newPassword;
    
    @NotBlank(message = "Şifre onayı boş olamaz")
    private String confirmPassword;
} 