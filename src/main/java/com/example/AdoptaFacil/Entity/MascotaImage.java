package com.example.AdoptaFacil.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "mascota_images")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MascotaImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota_image")
    private Long id;

    @Column(name = "imagen_path", nullable = false)
    private String imagenPath; // ruta de la imagen en "uploads/"

    private Integer orden = 1;

    // Relación con mascota - evitar referencia circular en JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnoreProperties({"imagenes", "aliado", "hibernateLazyInitializer", "handler"})
    private Mascotas mascota;
}

