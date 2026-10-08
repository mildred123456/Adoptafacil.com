package com.example.AdoptaFacil.Controller.auth;

import com.example.AdoptaFacil.DTO.PersonDTO;
import com.example.AdoptaFacil.DTO.auth.AuthResponseDTO;
import com.example.AdoptaFacil.DTO.auth.LoginRequestDTO;
import com.example.AdoptaFacil.DTO.auth.RegisterRequestDTO;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Repository.PersonRepository;
import com.example.AdoptaFacil.Repository.RoleRepository;
import com.example.AdoptaFacil.Util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Controlador de autenticación para AdoptaFácil
 * Maneja el registro de usuarios, inicio de sesión y endpoints de prueba
 * 
 * Rutas públicas:
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/register - Registrar nuevo usuario
 * - GET /api/auth/test - Prueba de conectividad
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Endpoint para iniciar sesión de usuario
     * Valida credenciales y genera token JWT si son correctas
     * 
     * @param loginRequest Datos de inicio de sesión (email y contraseña)
     * @return Token JWT y datos del usuario si la autenticación es exitosa
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            // Buscar usuario por email en la base de datos
            Optional<Person> personOpt = personRepository.findByEmail(loginRequest.getEmail());
            
            if (personOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
            }

            Person person = personOpt.get();
            
            // Verificar que la contraseña coincida con el hash almacenado
            if (!passwordEncoder.matches(loginRequest.getPassword(), person.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
            }

            // Generar token JWT con email y rol del usuario
            String token = jwtUtil.generateToken(
                person.getEmail(), 
                person.getRole().getRoleType().name()
            );

            // Crear respuesta con token y datos del usuario
            PersonDTO personDTO = createPersonDTO(person);
            AuthResponseDTO authResponse = new AuthResponseDTO(token, personDTO);
            
            return ResponseEntity.ok(authResponse);
            
        } catch (Exception e) {
            // Log del error y respuesta genérica para seguridad
            System.err.println("Error en login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }

    /**
     * Endpoint para registrar un nuevo usuario
     * Crea una nueva cuenta de usuario con el rol especificado
     * 
     * @param registerRequest Datos de registro (nombre, apellido, email, contraseña, rol)
     * @return Token JWT y datos del usuario si el registro es exitoso
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        try {
            // Verificar si el email ya está registrado
            if (personRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El email ya está registrado");
            }

            // Buscar el rol especificado en la base de datos
            Optional<Role> roleOpt = roleRepository.findByRoleType(registerRequest.getRole());
            if (roleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Rol inválido");
            }

            Role role = roleOpt.get();

            // Crear nueva instancia de Person con los datos proporcionados
            Person newPerson = new Person();
            newPerson.setName(registerRequest.getName());
            newPerson.setLastName(registerRequest.getLastName());
            newPerson.setEmail(registerRequest.getEmail());
            // Codificar la contraseña antes de guardarla
            newPerson.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            newPerson.setRole(role);

            // Guardar el nuevo usuario en la base de datos
            Person savedPerson = personRepository.save(newPerson);

            // Generar token JWT para el usuario recién registrado
            String token = jwtUtil.generateToken(
                savedPerson.getEmail(), 
                savedPerson.getRole().getRoleType().name()
            );

            // Crear respuesta con token y datos del usuario
            PersonDTO personDTO = createPersonDTO(savedPerson);
            AuthResponseDTO authResponse = new AuthResponseDTO(token, personDTO);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
            
        } catch (Exception e) {
            // Log del error y respuesta genérica para seguridad
            System.err.println("Error en registro: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor");
        }
    }
    
    /**
     * Endpoint de prueba para verificar conectividad de la API
     * Útil para testing y debugging
     * 
     * @return Mensaje de confirmación con timestamp
     */
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        return ResponseEntity.ok("API funcionando correctamente - " + LocalDateTime.now());
    }
    
    /**
     * Método auxiliar para convertir entidad Person a PersonDTO
     * Evita duplicación de código y centraliza la lógica de conversión
     * 
     * @param person Entidad Person a convertir
     * @return PersonDTO con los datos del usuario
     */
    private PersonDTO createPersonDTO(Person person) {
        PersonDTO personDTO = new PersonDTO();
        personDTO.setIdPerson(person.getIdPerson());
        personDTO.setName(person.getName());
        personDTO.setLastName(person.getLastName());
        personDTO.setEmail(person.getEmail());
        personDTO.setRole(person.getRole());
        return personDTO;
    }
}