package com.example.AdoptaFacil.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Configuración web para servir archivos estáticos (imágenes de mascotas)
 * y configurar CORS para permitir acceso desde el frontend
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.path}")
    private String uploadPath;

    /**
     * Configura el handler para servir imágenes estáticas desde la carpeta uploads
     * Las imágenes estarán disponibles en: http://localhost:8080/uploads/nombre-archivo.png
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convertir a URI file:/// para que Spring lo entienda
        String uploadsLocation = Paths.get(uploadPath).toUri().toString();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsLocation)
                .setCachePeriod(3600); // Cache de 1 hora
        
        System.out.println("✅ Configurado servicio de archivos estáticos:");
        System.out.println("   URL: /uploads/**");
        System.out.println("   Ubicación física: " + uploadsLocation);
    }

    /**
     * Configuración CORS para permitir acceso desde el frontend
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
