package com.example.AdoptaFacil.DTO.auth;

import com.example.AdoptaFacil.DTO.PersonDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String type = "Bearer";
    private PersonDTO user;
    
    public AuthResponseDTO(String token, PersonDTO user) {
        this.token = token;
        this.user = user;
    }
}