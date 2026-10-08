package com.example.AdoptaFacil.Util;

import com.example.AdoptaFacil.DTO.MascotaImageDTO;
import com.example.AdoptaFacil.DTO.MascotasDTO;
import com.example.AdoptaFacil.Entity.MascotaImage;
import com.example.AdoptaFacil.Entity.Mascotas;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades Mascotas y DTOs
 * Evita problemas de serialización de lazy loading de Hibernate
 */
@Component
public class MascotaMapper {

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.host:10.0.2.2}") // 10.0.2.2 para Android Emulator, localhost para web
    private String serverHost;

    /**
     * Convierte una ruta absoluta de archivo a una URL accesible desde el frontend
     * Ejemplo: C:/uploads/imagen.png -> http://10.0.2.2:8080/uploads/imagen.png
     */
    private String convertToUrl(String absolutePath) {
        if (absolutePath == null || absolutePath.isEmpty()) {
            return null;
        }
        
        // Obtener solo el nombre del archivo
        File file = new File(absolutePath);
        String fileName = file.getName();
        
        // Construir la URL completa usando el host configurado
        return "http://" + serverHost + ":" + serverPort + "/uploads/" + fileName;
    }

    /**
     * Convierte una entidad Mascotas a MascotasDTO
     * @param mascota Entidad de mascota
     * @return DTO de mascota sin relaciones lazy
     */
    public MascotasDTO toDTO(Mascotas mascota) {
        if (mascota == null) {
            return null;
        }

        MascotasDTO dto = new MascotasDTO();
        dto.setId(mascota.getId());
        dto.setNombre(mascota.getNombre());
        dto.setEspecie(mascota.getEspecie());
        dto.setRaza(mascota.getRaza());
        dto.setEdad(mascota.getEdad());
        dto.setFechaNacimiento(mascota.getFechaNacimiento());
        dto.setSexo(mascota.getSexo());
        dto.setCiudad(mascota.getCiudad());
        dto.setDescripcion(mascota.getDescripcion());
        dto.setImagen(convertToUrl(mascota.getImagen())); // Convertir a URL

        // Convertir las imágenes a DTOs
        if (mascota.getImagenes() != null && !mascota.getImagenes().isEmpty()) {
            List<MascotaImageDTO> imageDTOs = mascota.getImagenes().stream()
                    .map(this::toImageDTO)
                    .collect(Collectors.toList());
            dto.setImagenes(imageDTOs);
        }

        return dto;
    }

    /**
     * Convierte una entidad Mascotas a MascotasDTO incluyendo información del propietario
     * Para uso de administradores que necesitan ver quién registró cada mascota
     * @param mascota Entidad de mascota
     * @return DTO de mascota con información del propietario
     */
    public MascotasDTO toDTOConPropietario(Mascotas mascota) {
        if (mascota == null) {
            return null;
        }

        // Convertir usando el método base
        MascotasDTO dto = toDTO(mascota);

        // Agregar información del propietario si existe
        if (mascota.getALIADO() != null) {
            com.example.AdoptaFacil.DTO.PersonDTO propietario = new com.example.AdoptaFacil.DTO.PersonDTO();
            propietario.setIdPerson(mascota.getALIADO().getIdPerson());
            propietario.setName(mascota.getALIADO().getName());
            propietario.setLastName(mascota.getALIADO().getLastName());
            propietario.setEmail(mascota.getALIADO().getEmail());
            propietario.setRole(mascota.getALIADO().getRole());

            dto.setPerson(propietario);
        }

        return dto;
    }

    /**
     * Convierte una lista de entidades Mascotas a DTOs
     * @param mascotas Lista de entidades
     * @return Lista de DTOs
     */
    public List<MascotasDTO> toDTOList(List<Mascotas> mascotas) {
        if (mascotas == null) {
            return null;
        }
        return mascotas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una imagen de entidad a DTO
     * Convierte la ruta absoluta en una URL accesible
     * @param imagen Entidad de imagen
     * @return DTO de imagen con URL accesible
     */
    public MascotaImageDTO toImageDTO(MascotaImage imagen) {
        if (imagen == null) {
            return null;
        }
        return new MascotaImageDTO(
                imagen.getId(),
                convertToUrl(imagen.getImagenPath()), // Convertir a URL
                imagen.getOrden()
        );
    }
}
