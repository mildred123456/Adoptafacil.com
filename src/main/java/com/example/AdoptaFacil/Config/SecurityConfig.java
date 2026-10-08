package com.example.AdoptaFacil.Config;

import com.example.AdoptaFacil.Security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración de seguridad para la aplicación AdoptaFácil
 * Define las reglas de autorización, CORS y configuración JWT
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configura la cadena de filtros de seguridad
     * Define rutas públicas (/api/auth/**) y protegidas (resto de rutas)
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Deshabilitar CSRF ya que usamos JWT
            .csrf(csrf -> csrf.disable())
            // Configurar sesiones como stateless (sin estado)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Configurar autorización de peticiones
            .authorizeHttpRequests(authz -> authz
                    // Rutas públicas - accesibles sin autenticación
                    .requestMatchers("/api/auth/**").permitAll()
                    // Catálogo público de mascotas (solo lectura)
                    .requestMatchers(HttpMethod.GET, "/api/mascotas/publicas").permitAll()
                    // Permitir acceso público a las imágenes
                    .requestMatchers("/uploads/**").permitAll()
                    // Todas las demás rutas requieren autenticación
                    .anyRequest().authenticated()
            )
            // Añadir filtro JWT antes del filtro de autenticación estándar
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configura el codificador de contraseñas BCrypt
     * BCrypt es un algoritmo de hash seguro para contraseñas
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura CORS (Cross-Origin Resource Sharing)
     * Permite peticiones desde cualquier origen para desarrollo
     * En producción, se debe restringir a dominios específicos
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir cualquier origen (solo para desarrollo)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir credenciales
        configuration.setAllowCredentials(true);
        
        // Tiempo de cache para peticiones preflight
        configuration.setMaxAge(3600L);
        
        // Aplicar configuración a todas las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}