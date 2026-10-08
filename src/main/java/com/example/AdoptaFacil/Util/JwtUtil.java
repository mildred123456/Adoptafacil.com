package com.example.AdoptaFacil.Util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utilidad para la gestión de tokens JWT (JSON Web Tokens)
 * Proporciona funcionalidades para generar, validar y extraer información de tokens JWT
 * 
 * Configuración:
 * - jwt.secret: Clave secreta para firmar tokens (configurable en application.properties)
 * - jwt.expiration: Tiempo de expiración en milisegundos (por defecto 24 horas)
 */
@Component
public class JwtUtil {

    // Clave secreta para firmar tokens (debe ser de al menos 256 bits)
    @Value("${jwt.secret:mySecretKey123456789012345678901234567890}")
    private String secret;

    // Tiempo de expiración del token en milisegundos (24 horas por defecto)
    @Value("${jwt.expiration:86400000}")
    private Long expiration;

    /**
     * Genera la clave de firma para los tokens JWT
     * Utiliza el algoritmo HMAC-SHA256
     * 
     * @return SecretKey para firmar/verificar tokens
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Genera un nuevo token JWT para un usuario autenticado
     * 
     * @param email Email del usuario (usado como subject del token)
     * @param role Rol del usuario (almacenado como claim personalizado)
     * @return Token JWT firmado como String
     */
    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(email)                      // Email como identificador principal
                .claim("role", role)                    // Rol como claim personalizado
                .setIssuedAt(now)                       // Fecha de emisión
                .setExpiration(expiryDate)              // Fecha de expiración
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // Firma con HMAC-SHA256
                .compact();
    }

    /**
     * Extrae el email (subject) del token JWT
     * 
     * @param token Token JWT del cual extraer el email
     * @return Email del usuario
     * @throws JwtException si el token es inválido o está expirado
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }

    /**
     * Extrae el rol del usuario del token JWT
     * 
     * @param token Token JWT del cual extraer el rol
     * @return Rol del usuario
     * @throws JwtException si el token es inválido o está expirado
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        return claims.get("role", String.class);
    }

    /**
     * Valida la integridad y firma de un token JWT
     * No verifica expiración, solo la validez estructural
     * 
     * @param token Token JWT a validar
     * @return true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token malformado, firma inválida, etc.
            return false;
        }
    }

    /**
     * Verifica si un token JWT ha expirado
     * 
     * @param token Token JWT a verificar
     * @return true si el token está expirado, false si aún es válido
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            // Si no se puede parsear, consideramos que está expirado
            return true;
        }
    }
}