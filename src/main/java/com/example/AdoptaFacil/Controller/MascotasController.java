package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.DTO.MascotasDTO;
import com.example.AdoptaFacil.Entity.Mascotas;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Service.MascotasService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para la gestión de mascotas
 * 
 * Endpoints disponibles (requieren autenticación):
 * - POST /api/mascotas - Crear nueva mascota con imágenes opcionales
 * - GET /api/mascotas/{id} - Obtener mascota por ID
 * - GET /api/mascotas - Listar todas las mascotas o buscar por nombre
 * - PUT /api/mascotas/{id} - Actualizar mascota existente con imágenes opcionales
 * - DELETE /api/mascotas/{id} - Eliminar mascota
 */
@RestController
@RequestMapping("/api/mascotas")
@RequiredArgsConstructor
public class MascotasController {
    
    private final MascotasService mascotasService;

    /**
     * Crea una nueva mascota en el sistema
     * Permite adjuntar imágenes opcionales
     * 
     * @param nombre Nombre de la mascota
     * @param especie Especie de la mascota (perro, gato, otro)
     * @param raza Raza de la mascota
     * @param edad Edad de la mascota en años
     * @param fechaNacimiento Fecha de nacimiento de la mascota
     * @param sexo Sexo de la mascota (Macho, Hembra, Desconocido)
     * @param ciudad Ciudad donde se encuentra la mascota
     * @param descripcion Descripción opcional de la mascota
     * @param imagenes Lista opcional de imágenes de la mascota
     * @return Mascota creada con su ID asignado
     */
    @PostMapping
    public ResponseEntity<?> crearMascota(
            @RequestParam("nombre") String nombre,
            @RequestParam("especie") String especie,
            @RequestParam("raza") String raza,
            @RequestParam("edad") Integer edad,
            @RequestParam("fechaNacimiento") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaNacimiento,
            @RequestParam("sexo") String sexo,
            @RequestParam("ciudad") String ciudad,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "imagenes", required = false) List<MultipartFile> imagenes) {
        try {
            System.out.println("\n=== CREAR MASCOTA - INICIO ===");
            System.out.println("Nombre: " + nombre);
            System.out.println("Especie: " + especie);
            System.out.println("Raza: " + raza);
            System.out.println("Edad: " + edad);
            System.out.println("Imágenes: " + (imagenes != null ? imagenes.size() : 0));
            
            // Obtener usuario autenticado del SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication: " + authentication);
            System.out.println("Principal: " + authentication.getPrincipal());
            
            if (authentication == null || authentication.getPrincipal() == null) {
                System.err.println("ERROR: No hay usuario autenticado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
            }
            
            Person person;
            if (authentication.getPrincipal() instanceof Person) {
                person = (Person) authentication.getPrincipal();
                System.out.println("Usuario autenticado: " + person.getEmail() + " (ID: " + person.getIdPerson() + ")");
            } else {
                System.err.println("ERROR: Principal no es de tipo Person: " + authentication.getPrincipal().getClass());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error de autenticación");
            }
            
            // Crear objeto Mascotas
            Mascotas mascota = new Mascotas();
            mascota.setNombre(nombre);
            mascota.setEspecie(especie);
            mascota.setRaza(raza);
            mascota.setEdad(edad);
            mascota.setFechaNacimiento(fechaNacimiento);
            mascota.setSexo(sexo);
            mascota.setCiudad(ciudad);
            mascota.setDescripcion(descripcion);
            mascota.setALIADO(person);
            
            System.out.println("Llamando a mascotasService.crearMascota()");
            MascotasDTO mascotaCreada = mascotasService.crearMascota(mascota, imagenes);
            System.out.println("Mascota creada con ID: " + mascotaCreada.getId());
            System.out.println("=== CREAR MASCOTA - FIN EXITOSO ===\n");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(mascotaCreada);
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR: Datos inválidos - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Datos de mascota inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO creando mascota: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Catálogo público de mascotas en adopción.
     * Lo usa la pantalla "Mascotas" del frontend para que cualquier usuario
     * (adoptantes incluidos) vea todas las mascotas registradas.
     * Solo lectura y SIN datos del propietario.
     *
     * @return Lista de todas las mascotas
     */
    @GetMapping("/publicas")
    public ResponseEntity<?> listarMascotasPublicas() {
        try {
            return ResponseEntity.ok(mascotasService.listarMascotas());
        } catch (Exception e) {
            System.err.println("Error listando mascotas públicas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Obtiene una mascota específica por su ID
     *
     * @param id ID único de la mascota
     * @return Datos completos de la mascota incluyendo imágenes
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerMascota(@PathVariable Long id) {
        try {
            MascotasDTO mascota = mascotasService.obtenerMascota(id);
            if (mascota == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(mascota);
        } catch (Exception e) {
            System.err.println("Error obteniendo mascota: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista las mascotas del usuario autenticado (solo para ALIADOs)
     * Si se proporciona el parámetro 'nombre', filtra los resultados
     * 
     * @param nombre Nombre opcional para filtrar mascotas
     * @return Lista de mascotas del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<?> listarMascotasDelUsuario(@RequestParam(required = false) String nombre) {
        try {
            System.out.println("\n=== LISTAR MASCOTAS DEL USUARIO - INICIO ===");
            
            // Obtener usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
            }
            
            Person person;
            if (authentication.getPrincipal() instanceof Person) {
                person = (Person) authentication.getPrincipal();
                System.out.println("Listando mascotas para usuario: " + person.getEmail() + " (ID: " + person.getIdPerson() + ", Rol: " + person.getRole().getRoleType() + ")");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error de autenticación");
            }
            
            List<MascotasDTO> mascotas;
            
            if (nombre != null && !nombre.trim().isEmpty()) {
                // Buscar mascotas por nombre del usuario autenticado
                mascotas = mascotasService.buscarPorNombreYUsuario(nombre.trim(), person);
            } else {
                // Listar mascotas del usuario autenticado
                mascotas = mascotasService.listarMascotasPorUsuario(person);
            }
            
            System.out.println("Mascotas encontradas para el usuario: " + mascotas.size());
            System.out.println("=== LISTAR MASCOTAS DEL USUARIO - FIN ===\n");
            
            return ResponseEntity.ok(mascotas);
        } catch (Exception e) {
            System.err.println("Error listando mascotas del usuario: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista TODAS las mascotas del sistema con información del propietario
     * Solo para usuarios ADMIN
     * 
     * @return Lista de todas las mascotas con información del propietario
     */
    @GetMapping("/admin/all")
    public ResponseEntity<?> listarTodasLasMascotas() {
        try {
            System.out.println("\n=== LISTAR TODAS LAS MASCOTAS (ADMIN) - INICIO ===");
            
            // Obtener usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
            }
            
            Person person;
            if (authentication.getPrincipal() instanceof Person) {
                person = (Person) authentication.getPrincipal();
                System.out.println("Usuario autenticado: " + person.getEmail() + " (Rol: " + person.getRole().getRoleType() + ")");
                
                // Verificar que sea ADMIN - Comparar con el ENUM, no con String
                if (person.getRole().getRoleType() != Role.RoleType.ADMIN) {
                    System.err.println("ERROR: Usuario no es ADMIN: " + person.getRole().getRoleType());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Acceso denegado. Solo administradores pueden ver todas las mascotas.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error de autenticación");
            }
            
            // Listar todas las mascotas con información del propietario
            List<MascotasDTO> mascotas = mascotasService.listarTodasLasMascotasConPropietario();
            
            System.out.println("Total de mascotas en el sistema: " + mascotas.size());
            System.out.println("=== LISTAR TODAS LAS MASCOTAS (ADMIN) - FIN ===\n");
            
            return ResponseEntity.ok(mascotas);
        } catch (Exception e) {
            System.err.println("Error listando todas las mascotas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Actualiza una mascota existente en el sistema
     * Permite actualizar datos y adjuntar nuevas imágenes
     * Solo el dueño de la mascota puede actualizarla
     * 
     * @param id ID de la mascota a actualizar
     * @param nombre Nombre de la mascota
     * @param especie Especie de la mascota
     * @param raza Raza de la mascota
     * @param edad Edad de la mascota
     * @param fechaNacimiento Fecha de nacimiento
     * @param sexo Sexo de la mascota
     * @param ciudad Ciudad
     * @param descripcion Descripción
     * @param imagenes Lista opcional de nuevas imágenes
     * @return Mascota actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMascota(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam("especie") String especie,
            @RequestParam("raza") String raza,
            @RequestParam("edad") Integer edad,
            @RequestParam("fechaNacimiento") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaNacimiento,
            @RequestParam("sexo") String sexo,
            @RequestParam("ciudad") String ciudad,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "imagenes", required = false) List<MultipartFile> imagenes) {
        try {
            System.out.println("\n=== ACTUALIZAR MASCOTA - INICIO ===");
            System.out.println("ID Mascota: " + id);
            System.out.println("Nombre: " + nombre);
            
            // Obtener el usuario autenticado del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                System.err.println("ERROR: Usuario no autenticado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
            }
            
            Person person = (Person) authentication.getPrincipal();
            System.out.println("Usuario autenticado: " + person.getEmail() + " (ID: " + person.getIdPerson() + ")");
            
            System.out.println("✅ Usuario autenticado, procediendo a actualizar");
            
            // Crear objeto Mascotas con los datos actualizados
            Mascotas mascota = new Mascotas();
            mascota.setId(id);
            mascota.setNombre(nombre);
            mascota.setEspecie(especie);
            mascota.setRaza(raza);
            mascota.setEdad(edad);
            mascota.setFechaNacimiento(fechaNacimiento);
            mascota.setSexo(sexo);
            mascota.setCiudad(ciudad);
            mascota.setDescripcion(descripcion);
            mascota.setALIADO(person);
            
            System.out.println("Llamando a mascotasService.actualizarMascota()");
            // Actualizar la mascota usando el servicio
            MascotasDTO mascotaActualizada = mascotasService.actualizarMascota(id, mascota, imagenes);
            
            if (mascotaActualizada == null) {
                System.err.println("ERROR: mascotasService devolvió null");
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("✅ Mascota actualizada con ID: " + mascotaActualizada.getId());
            System.out.println("=== ACTUALIZAR MASCOTA - FIN EXITOSO ===\n");
            
            return ResponseEntity.ok(mascotaActualizada);
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR: Datos inválidos - " + e.getMessage());
            return ResponseEntity.badRequest().body("Datos de mascota inválidos: " + e.getMessage());
        } catch (SecurityException e) {
            System.err.println("ERROR: Sin permisos - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO actualizando mascota: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

    /**
     * Elimina una mascota del sistema
     * También elimina todas las imágenes asociadas
     * Solo el dueño de la mascota puede eliminarla
     * 
     * @param id ID único de la mascota a eliminar
     * @return Status 204 (No Content) si la eliminación es exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMascota(@PathVariable Long id) {
        try {
            System.out.println("\n=== ELIMINAR MASCOTA - INICIO ===");
            System.out.println("ID Mascota: " + id);
            
            // Obtener el usuario autenticado del contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                System.err.println("ERROR: Usuario no autenticado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no autenticado");
            }
            
            Person person = (Person) authentication.getPrincipal();
            System.out.println("Usuario autenticado: " + person.getEmail() + " (ID: " + person.getIdPerson() + ")");
            System.out.println("Rol: " + (person.getRole() != null ? person.getRole().getRoleType() : "sin rol"));
            
            System.out.println("✅ Usuario autenticado, procediendo a eliminar");
            System.out.println("Llamando a mascotasService.eliminarMascotaPorUsuario()");
            
            mascotasService.eliminarMascotaPorUsuario(id, person);
            
            System.out.println("✅ Mascota eliminada exitosamente");
            System.out.println("=== ELIMINAR MASCOTA - FIN EXITOSO ===\n");
            
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            System.err.println("ERROR: " + e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            System.err.println("ERROR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error eliminando mascota: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
}
