package com.example.AdoptaFacil.DTO;

import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Entity.Mascotas;
import lombok.Data;

@Data
public class SolicitudesDTO {
    private Long id;
    private Person solicitante;
    private Mascotas mascota;
    private String estado; // PENDIENTE, APROBADA, RECHAZADA
    private String comentario;
}
