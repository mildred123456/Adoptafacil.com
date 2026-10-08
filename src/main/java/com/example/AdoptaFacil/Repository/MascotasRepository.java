package com.example.AdoptaFacil.Repository;

import com.example.AdoptaFacil.Entity.Mascotas;
import com.example.AdoptaFacil.Entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MascotasRepository extends JpaRepository<Mascotas, Long> {
    List<Mascotas> findByNombreContainingIgnoreCase(String nombre);
    List<Mascotas> findByEspecie(String especie);
    
    /**
     * Busca mascotas por usuario con JOIN FETCH para cargar imágenes de forma anticipada
     * Esto evita el LazyInitializationException
     */
    @Query("SELECT DISTINCT m FROM Mascotas m LEFT JOIN FETCH m.imagenes WHERE m.ALIADO = :aliado")
    List<Mascotas> findByALIADOWithImages(@Param("aliado") Person aliado);
    
    /**
     * Busca mascotas por nombre y usuario con JOIN FETCH para cargar imágenes
     */
    @Query("SELECT DISTINCT m FROM Mascotas m LEFT JOIN FETCH m.imagenes WHERE LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND m.ALIADO = :aliado")
    List<Mascotas> findByNombreContainingIgnoreCaseAndALIADOWithImages(@Param("nombre") String nombre, @Param("aliado") Person aliado);
    
    /**
     * Encuentra todas las mascotas con imágenes cargadas de forma anticipada
     * Para uso administrativo
     */
    @Query("SELECT DISTINCT m FROM Mascotas m LEFT JOIN FETCH m.imagenes LEFT JOIN FETCH m.ALIADO")
    List<Mascotas> findAllWithImagesAndOwner();
    
    /**
     * Encuentra una mascota por ID con imágenes cargadas
     */
    @Query("SELECT m FROM Mascotas m LEFT JOIN FETCH m.imagenes WHERE m.id = :id")
    Optional<Mascotas> findByIdWithImages(@Param("id") Long id);
    
    // Mantener los métodos originales para compatibilidad (aunque no se recomienda usarlos)
    List<Mascotas> findByALIADO(Person aliado);
    List<Mascotas> findByNombreContainingIgnoreCaseAndALIADO(String nombre, Person aliado);
}
