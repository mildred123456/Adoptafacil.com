package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.DTO.RoleDTO;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de roles del sistema
 * 
 * Endpoints disponibles (requieren autenticación):
 * - GET /api/roles - Listar todos los roles
 * - GET /api/roles/{id} - Obtener rol por ID
 * - GET /api/roles/type/{roleType} - Obtener rol por tipo
 * - POST /api/roles - Crear nuevo rol
 * - PUT /api/roles/{id} - Actualizar rol
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Lista todos los roles disponibles en el sistema
     * 
     * @return Lista completa de roles (CLIENTE, ALIADO, etc.)
     */
    @GetMapping
    public ResponseEntity<?> listRoles() {
        try {
            List<RoleDTO> roles = roleService.listRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            System.err.println("Error listando roles: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Obtiene un rol específico por su ID
     * 
     * @param id ID único del rol
     * @return Datos del rol
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        try {
            RoleDTO role = roleService.getRoleById(id);
            if (role == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            System.err.println("Error obteniendo rol por ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Busca un rol por su tipo específico
     * 
     * @param roleType Tipo de rol (CLIENTE, ALIADO, etc.)
     * @return Datos del rol si existe
     */
    @GetMapping("/type/{roleType}")
    public ResponseEntity<?> getRoleByType(@PathVariable Role.RoleType roleType) {
        try {
            RoleDTO role = roleService.getRoleByType(roleType);
            if (role == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            System.err.println("Error obteniendo rol por tipo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Crea un nuevo rol en el sistema
     * 
     * @param roleDTO Datos del rol a crear
     * @return Rol creado con su ID asignado
     */
    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody RoleDTO roleDTO) {
        try {
            RoleDTO createdRole = roleService.createRole(roleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos de rol inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creando rol: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Actualiza los datos de un rol existente
     * 
     * @param id ID del rol a actualizar
     * @param roleDTO Nuevos datos del rol
     * @return Rol actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        try {
            RoleDTO updatedRole = roleService.updateRole(id, roleDTO);
            if (updatedRole == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedRole);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error actualizando rol: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
}
