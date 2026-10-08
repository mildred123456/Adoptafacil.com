
package com.example.AdoptaFacil.Entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "solicitudes")
@Data
public class Solicitudes {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "person_id", nullable = false)
	private Person solicitante;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mascota_id", nullable = false)
	private Mascotas mascota;

	@NotBlank
	@Column(nullable = false)
	private String estado; // PENDIENTE, APROBADA, RECHAZADA

	private String comentario;
}
