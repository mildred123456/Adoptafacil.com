package com.example.AdoptaFacil.DTO.auth;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un email válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}