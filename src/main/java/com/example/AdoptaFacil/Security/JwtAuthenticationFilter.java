package com.example.AdoptaFacil.Security;

import com.example.AdoptaFacil.Util.JwtUtil;
import com.example.AdoptaFacil.Repository.PersonRepository;
import com.example.AdoptaFacil.Entity.Person;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

/**
 * Filtro JWT para validar tokens de autenticación en cada petición
 * Este filtro intercepta todas las peticiones HTTP y valida el token JWT
 * si está presente en el header Authorization
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonRepository personRepository;

    /**
     * Ejecuta el filtro para cada petición HTTP
     * Extrae y valida el token JWT del header Authorization
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // Extraer token JWT del header Authorization
            String jwt = extractJwtFromRequest(request);
            
            // Validar token y configurar contexto de seguridad si es válido
            if (jwt != null && jwtUtil.validateToken(jwt) && !jwtUtil.isTokenExpired(jwt)) {
                authenticateUser(jwt, request);
            }
            
        } catch (Exception e) {
            // Log del error pero continúa con la cadena de filtros
            logger.error("Error al procesar token JWT: " + e.getMessage());
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token JWT del header Authorization
     * Formato esperado: "Bearer <token>"
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // Remover "Bearer " del inicio
        }
        
        return null;
    }

    /**
     * Autentica al usuario basado en el token JWT válido
     * Configura el contexto de seguridad de Spring Security
     */
    private void authenticateUser(String jwt, HttpServletRequest request) {
        try {
            // Extraer email del token
            String email = jwtUtil.getEmailFromToken(jwt);
            String role = jwtUtil.getRoleFromToken(jwt);
            
            // Verificar que el usuario existe en la base de datos
            Optional<Person> personOpt = personRepository.findByEmail(email);
            
            if (personOpt.isPresent()) {
                Person person = personOpt.get();
                
                // Crear autoridad basada en el rol del usuario
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                
                // Crear token de autenticación
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        person, 
                        null, 
                        Collections.singletonList(authority)
                    );
                
                // Configurar detalles de la petición
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Establecer autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            
        } catch (Exception e) {
            logger.error("Error al autenticar usuario: " + e.getMessage());
        }
    }
}