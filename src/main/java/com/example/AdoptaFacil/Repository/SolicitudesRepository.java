package com.example.AdoptaFacil.Repository;

import com.example.AdoptaFacil.Entity.Solicitudes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudesRepository extends JpaRepository<Solicitudes, Long> {
    // Métodos personalizados si se requieren
}
