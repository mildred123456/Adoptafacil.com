package com.example.AdoptaFacil.Controller;

import com.example.AdoptaFacil.DTO.PersonDTO;
import com.example.AdoptaFacil.Service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de personas/usuarios
 * 
 * Endpoints disponibles (requieren autenticación):
 * - GET /api/persons - Listar todas las personas
 * - GET /api/persons/{id} - Obtener persona por ID
 * - GET /api/persons/email/{email} - Obtener persona por email
 * - GET /api/persons/role/{roleType} - Listar personas por rol
 * - POST /api/persons - Crear nueva persona
 * - PUT /api/persons/{id} - Actualizar persona
 * - DELETE /api/persons/{id} - Eliminar persona
 */
@RestController
@RequestMapping("/api/persons")
public class PersonController {

    @Autowired
    private PersonService personService;

    /**
     * Lista todas las personas registradas en el sistema
     * 
     * @return Lista completa de personas (sin contraseñas)
     */
    @GetMapping
    public ResponseEntity<?> listPersons() {
        try {
            List<PersonDTO> persons = personService.listPersons();
            return ResponseEntity.ok(persons);
        } catch (Exception e) {
            System.err.println("Error listando personas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Obtiene una persona específica por su ID
     * 
     * @param id ID único de la persona
     * @return Datos de la persona sin contraseña
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable Long id) {
        try {
            PersonDTO person = personService.getPersonById(id);
            if (person == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(person);
        } catch (Exception e) {
            System.err.println("Error obteniendo persona por ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Busca una persona por su dirección de email
     * 
     * @param email Dirección de email de la persona
     * @return Datos de la persona si existe
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getPersonByEmail(@PathVariable String email) {
        try {
            PersonDTO person = personService.getPersonByEmail(email);
            if (person == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(person);
        } catch (Exception e) {
            System.err.println("Error obteniendo persona por email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Lista todas las personas que tienen un rol específico
     * 
     * @param roleType Tipo de rol a filtrar (CLIENTE, ALIADO, etc.)
     * @return Lista de personas con el rol especificado
     */
    @GetMapping("/role/{roleType}")
    public ResponseEntity<?> listPersonByRole(@PathVariable String roleType) {
        try {
            List<PersonDTO> persons = personService.listPersonByRole(roleType);
            return ResponseEntity.ok(persons);
        } catch (Exception e) {
            System.err.println("Error listando personas por rol: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Crea una nueva persona en el sistema
     * 
     * @param personDTO Datos de la persona a crear
     * @return Persona creada con su ID asignado
     */
    @PostMapping
    public ResponseEntity<?> createPerson(@RequestBody PersonDTO personDTO) {
        try {
            PersonDTO createdPerson = personService.createPerson(personDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPerson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creando persona: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Actualiza los datos de una persona existente
     * 
     * @param id ID de la persona a actualizar
     * @param personDTO Nuevos datos de la persona
     * @return Persona actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerson(@PathVariable Long id, @RequestBody PersonDTO personDTO) {
        try {
            PersonDTO updatedPerson = personService.updatePerson(id, personDTO);
            if (updatedPerson == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedPerson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error actualizando persona: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Elimina una persona del sistema
     * 
     * @param id ID de la persona a eliminar
     * @return Status 204 (No Content) si la eliminación es exitosa
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        try {
            personService.deletePerson(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error eliminando persona: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
}
