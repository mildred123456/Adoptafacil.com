package com.example.AdoptaFacil.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaImageDTO {
    private Long id;
    private String imagenPath;
    private Integer orden;
}
