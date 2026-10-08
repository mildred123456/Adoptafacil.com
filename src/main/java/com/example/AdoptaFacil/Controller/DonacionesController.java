package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.DTO.DonacionesDTO;
import com.example.AdoptaFacil.Service.DonacionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de donaciones
 * 
 * Endpoints disponibles (requieren autenticación):
 * - POST /api/donaciones - Crear nueva donación
 * - GET /api/donaciones - Listar todas las donaciones
 * - GET /api/donaciones/{id} - Obtener donación por ID
 * - GET /api/donaciones/donante/{donanteId} - Obtener donaciones por donante
 * - DELETE /api/donaciones/{id} - Eliminar donación
 */
@RestController
@RequestMapping("/api/donaciones")
public class DonacionesController {

    @Autowired
    private DonacionesService donacionesService;

    /**
     * Crea una nueva donación en el sistema
     * 
     * @param donacionDTO Datos de la donación a crear
     * @return Donación creada con su ID asignado
     */
    @PostMapping
    public ResponseEntity<?> crearDonacion(@RequestBody DonacionesDTO donacionDTO) {
        try {
            DonacionesDTO nuevaDonacion = donacionesService.crearDonacion(donacionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDonacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos de donación inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creando donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista todas las donaciones registradas en el sistema
     * 
     * @return Lista completa de donaciones
     */
    @GetMapping
    public ResponseEntity<?> listarDonaciones() {
        try {
            List<DonacionesDTO> donaciones = donacionesService.listarDonaciones();
            return ResponseEntity.ok(donaciones);
        } catch (Exception e) {
            System.err.println("Error listando donaciones: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Obtiene una donación específica por su ID
     * 
     * @param id ID único de la donación
     * @return Datos completos de la donación
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDonacionPorId(@PathVariable Long id) {
        try {
            DonacionesDTO donacion = donacionesService.obtenerDonacionPorId(id);
            if (donacion == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(donacion);
        } catch (Exception e) {
            System.err.println("Error obteniendo donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista todas las donaciones realizadas por un donante específico
     * 
     * @param donanteId ID del donante
     * @return Lista de donaciones del donante
     */
    @GetMapping("/donante/{donanteId}")
    public ResponseEntity<?> obtenerDonacionesPorDonante(@PathVariable Long donanteId) {
        try {
            List<DonacionesDTO> donaciones = donacionesService.obtenerDonacionesPorDonante(donanteId);
            return ResponseEntity.ok(donaciones);
        } catch (Exception e) {
            System.err.println("Error obteniendo donaciones por donante: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Elimina una donación del sistema
     * 
     * @param id ID único de la donación a eliminar
     * @return Status 204 (No Content) si la eliminación es exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDonacion(@PathVariable Long id) {
        try {
            donacionesService.eliminarDonacion(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error eliminando donación: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
}
