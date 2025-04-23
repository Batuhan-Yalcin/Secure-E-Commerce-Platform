package com.batuhanyalcin.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateDTO {
    @NotBlank(message = "Ad boş olamaz")
    @Size(max = 50, message = "Ad 50 karakterden uzun olamaz")
    private String firstName;
    
    @NotBlank(message = "Soyad boş olamaz")
    @Size(max = 50, message = "Soyad 50 karakterden uzun olamaz")
    private String lastName;
    
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;
    
    @Size(max = 15, message = "Telefon numarası 15 karakterden uzun olamaz")
    private String phoneNumber;
    
    @Size(max = 255, message = "Adres 255 karakterden uzun olamaz")
    private String address;
} 