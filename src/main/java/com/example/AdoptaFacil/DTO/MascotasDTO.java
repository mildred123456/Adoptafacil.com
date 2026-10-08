package com.example.AdoptaFacil.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class MascotasDTO {
    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private Integer edad;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String ciudad;
    private String descripcion;
    private String imagen; // imagen principal
    private List<MascotaImageDTO> imagenes; // Cambiar a DTO de imágenes
    
    // Información del propietario (para vista de administrador)
    private PersonDTO person; // Datos del propietario que registró la mascota
}
