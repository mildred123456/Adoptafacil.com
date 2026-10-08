package com.example.AdoptaFacil.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mascotas")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Mascotas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota")
    private Long id;

    @NotBlank
    @Column(name="nombre",length = 100, nullable = false)
    private String nombre;

    @NotBlank
    @Column(name="especie",length = 50, nullable = false)
    private String especie;  //perro gato o otro

    @NotBlank
    @Column(name="raza",length = 50, nullable = false)
    private String raza;

    @NotNull(message = "La edad es obligatoria")
    @Column(name = "edad", nullable = false)
    private Integer edad;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name="sexo")
    private String sexo; // macho o hembra

    @Column(name="ciudad")
    private String ciudad;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String imagen;//imagen principal

    // Relación con person - Ignorar la relación completa en la serialización JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_person", nullable = false)  // FK person_id
    @JsonIgnoreProperties({"password", "role", "mascotas", "hibernateLazyInitializer", "handler"})
    private Person ALIADO;

    // Relación con mascotaImage
    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"mascota", "hibernateLazyInitializer", "handler"})
    private List<MascotaImage> imagenes = new ArrayList<>();
}

