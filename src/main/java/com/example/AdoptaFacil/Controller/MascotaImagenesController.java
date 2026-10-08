package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.Service.MascotasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestión de imágenes de mascotas
 * Permite eliminar imágenes individuales de una mascota
 */
@RestController
@RequestMapping("/api/mascotas/{mascotaId}/imagenes")
@RequiredArgsConstructor
public class MascotaImagenesController {
    
    private final MascotasService mascotasService;

    /**
     * Elimina una imagen específica de una mascota
     * 
     * @param mascotaId ID de la mascota
     * @param imagenId ID de la imagen a eliminar
     * @return Respuesta con el resultado de la operación
     */
    @DeleteMapping("/{imagenId}")
    public ResponseEntity<?> eliminarImagen(
            @PathVariable Long mascotaId,
            @PathVariable Long imagenId) {
        try {
            System.out.println("\n=== ELIMINAR IMAGEN - INICIO ===");
            System.out.println("Mascota ID: " + mascotaId);
            System.out.println("Imagen ID: " + imagenId);
            
            mascotasService.eliminarImagen(mascotaId, imagenId);
            
            System.out.println("✅ Imagen eliminada exitosamente");
            System.out.println("=== ELIMINAR IMAGEN - FIN ===\n");
            
            return ResponseEntity.ok().body("Imagen eliminada correctamente");
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            System.err.println("❌ Error de seguridad: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al eliminar la imagen");
        }
    }
}
