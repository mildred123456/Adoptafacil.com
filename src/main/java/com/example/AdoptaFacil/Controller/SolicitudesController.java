package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.Entity.Solicitudes;
import com.example.AdoptaFacil.Service.SolicitudesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de solicitudes de adopción
 * 
 * Endpoints disponibles (requieren autenticación):
 * - POST /api/solicitudes - Crear nueva solicitud de adopción
 * - GET /api/solicitudes - Listar todas las solicitudes
 * - PUT /api/solicitudes/{id}/estado - Cambiar estado de solicitud
 */
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudesController {

    @Autowired
    private SolicitudesService solicitudesService;

    /**
     * Crea una nueva solicitud de adopción
     * 
     * @param solicitud Datos de la solicitud a crear
     * @return Solicitud creada con su ID asignado
     */
    @PostMapping
    public ResponseEntity<?> crearSolicitud(@RequestBody Solicitudes solicitud) {
        try {
            Solicitudes nuevaSolicitud = solicitudesService.crearSolicitud(solicitud);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos de solicitud inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creando solicitud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista todas las solicitudes de adopción en el sistema
     * 
     * @return Lista completa de solicitudes
     */
    @GetMapping
    public ResponseEntity<?> listarSolicitudes() {
        try {
            List<Solicitudes> solicitudes = solicitudesService.listarSolicitudes();
            return ResponseEntity.ok(solicitudes);
        } catch (Exception e) {
            System.err.println("Error listando solicitudes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Cambia el estado de una solicitud de adopción
     * Estados posibles: PENDIENTE, APROBADA, RECHAZADA
     * 
     * @param id ID de la solicitud
     * @param estado Nuevo estado de la solicitud
     * @param comentario Comentario opcional sobre el cambio de estado
     * @return Solicitud actualizada
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id, 
            @RequestParam String estado, 
            @RequestParam(required = false) String comentario) {
        try {
            Solicitudes solicitudActualizada = solicitudesService.cambiarEstado(id, estado, comentario);
            if (solicitudActualizada == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(solicitudActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado inválido: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error cambiando estado de solicitud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
}
