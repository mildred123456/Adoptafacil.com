package com.example.AdoptaFacil.Implement;

import com.example.AdoptaFacil.DTO.MascotasDTO;
import com.example.AdoptaFacil.Entity.MascotaImage;
import com.example.AdoptaFacil.Entity.Mascotas;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Entity.Role;
import com.example.AdoptaFacil.Repository.MascotasRepository;
import com.example.AdoptaFacil.Service.MascotasService;
import com.example.AdoptaFacil.Util.MascotaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MascotasServiceImpl implements MascotasService {

    private final MascotasRepository mascotasRepository;
    private final MascotaMapper mascotaMapper;
    
    @Value("${upload.path}")
    private String uploadPath;

    @Override
    @Transactional
    public MascotasDTO crearMascota(Mascotas mascota, List<MultipartFile> imagenes) {
        System.out.println("\n=== SERVICE: Creando mascota ===");
        
        if (imagenes != null && imagenes.size() > 3) {
            throw new IllegalArgumentException("Máximo 3 imágenes permitidas");
        }

        // Guardar la mascota primero para obtener el ID
        Mascotas nuevaMascota = mascotasRepository.save(mascota);
        System.out.println("✅ Mascota guardada con ID: " + nuevaMascota.getId());

        // Procesar y guardar imágenes si se proporcionan
        if (imagenes != null && !imagenes.isEmpty()) {
            try {
                // Crear el directorio si no existe
                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    System.out.println("✅ Directorio de uploads creado: " + uploadDir.toAbsolutePath());
                }
                
                int orden = 1;
                for (MultipartFile file : imagenes) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path destinoPath = uploadDir.resolve(fileName);
                        File destino = destinoPath.toFile();
                        
                        file.transferTo(destino);
                        System.out.println("✅ Imagen guardada: " + destino.getAbsolutePath());

                        MascotaImage img = new MascotaImage();
                        img.setImagenPath(destino.getAbsolutePath());
                        img.setOrden(orden++);
                        img.setMascota(nuevaMascota);
                        nuevaMascota.getImagenes().add(img);

                    } catch (IOException e) {
                        System.err.println("❌ Error guardando imagen: " + e.getMessage());
                        throw new IllegalArgumentException("Error al guardar imagen: " + e.getMessage());
                    }
                }
            } catch (IOException e) {
                System.err.println("❌ Error creando directorio de uploads: " + e.getMessage());
                throw new IllegalArgumentException("Error al crear directorio de uploads: " + e.getMessage());
            }
            
            // Guardar nuevamente para persistir las imágenes
            nuevaMascota = mascotasRepository.save(nuevaMascota);
            System.out.println("✅ Imágenes asociadas a la mascota");
        }

        System.out.println("=== SERVICE: Mascota creada exitosamente ===\n");
        
        // Convertir a DTO para evitar problemas de lazy loading
        return mascotaMapper.toDTO(nuevaMascota);
    }

    @Override
    @Transactional(readOnly = true)
    public MascotasDTO obtenerMascota(Long id) {
        System.out.println("\n=== SERVICE: Obteniendo mascota ID " + id + " ===");
        
        // Usar consulta con JOIN FETCH para cargar imágenes
        Mascotas mascota = mascotasRepository.findByIdWithImages(id)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + id));
        
        System.out.println("✅ Mascota encontrada: " + mascota.getNombre());
        System.out.println("=== SERVICE: FIN obtención ===\n");
        
        return mascotaMapper.toDTO(mascota);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotasDTO> listarMascotas() {
        System.out.println("\n=== SERVICE: Listando todas las mascotas ===");
        
        List<Mascotas> mascotas = mascotasRepository.findAll();
        
        System.out.println("✅ Se encontraron " + mascotas.size() + " mascotas");
        System.out.println("=== SERVICE: FIN listado ===\n");
        
        return mascotaMapper.toDTOList(mascotas);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotasDTO> buscarPorNombre(String nombre) {
        System.out.println("\n=== SERVICE: Buscando mascotas por nombre: " + nombre + " ===");
        
        List<Mascotas> mascotas = mascotasRepository.findByNombreContainingIgnoreCase(nombre);
        
        System.out.println("✅ Se encontraron " + mascotas.size() + " mascotas");
        System.out.println("=== SERVICE: FIN búsqueda ===\n");
        
        return mascotaMapper.toDTOList(mascotas);
    }

    @Override
    @Transactional
    public MascotasDTO actualizarMascota(Long id, Mascotas mascotaActualizada, List<MultipartFile> imagenes) {
        System.out.println("\n=== SERVICE: Actualizando mascota ID " + id + " ===");
        
        // Buscar la mascota existente
        Mascotas mascotaExistente = mascotasRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + id));

        System.out.println("✅ Mascota encontrada: " + mascotaExistente.getNombre());
        
        // Verificar permisos: ADMIN puede editar todas, ALIADO solo las suyas
        if (mascotaActualizada.getALIADO() != null) {
            Long idUsuarioActual = mascotaActualizada.getALIADO().getIdPerson();
            Long idDueno = mascotaExistente.getALIADO().getIdPerson();
            
            // Verificar si el usuario es ADMIN
            boolean esAdmin = mascotaActualizada.getALIADO().getRole() != null && 
                            mascotaActualizada.getALIADO().getRole().getRoleType() == Role.RoleType.ADMIN;
            
            if (!esAdmin && !idDueno.equals(idUsuarioActual)) {
                System.err.println("❌ Usuario " + idUsuarioActual + " no es el dueño de la mascota (dueño: " + idDueno + ")");
                throw new SecurityException("No tienes permisos para actualizar esta mascota");
            }
            System.out.println("✅ Usuario autorizado" + (esAdmin ? " (ADMIN)" : " (dueño)"));
        }
        
        // Validar número máximo de imágenes si se proporcionan nuevas
        if (imagenes != null && imagenes.size() > 3) {
            throw new IllegalArgumentException("Máximo 3 imágenes permitidas");
        }

        // Actualizar campos básicos
        mascotaExistente.setNombre(mascotaActualizada.getNombre());
        mascotaExistente.setEspecie(mascotaActualizada.getEspecie());
        mascotaExistente.setRaza(mascotaActualizada.getRaza());
        mascotaExistente.setEdad(mascotaActualizada.getEdad());
        
        // Actualizar campos opcionales si se proporcionan
        if (mascotaActualizada.getSexo() != null) {
            mascotaExistente.setSexo(mascotaActualizada.getSexo());
        }
        if (mascotaActualizada.getCiudad() != null) {
            mascotaExistente.setCiudad(mascotaActualizada.getCiudad());
        }
        if (mascotaActualizada.getDescripcion() != null) {
            mascotaExistente.setDescripcion(mascotaActualizada.getDescripcion());
        }
        if (mascotaActualizada.getFechaNacimiento() != null) {
            mascotaExistente.setFechaNacimiento(mascotaActualizada.getFechaNacimiento());
        }

        System.out.println("✅ Campos actualizados");

        // Procesar nuevas imágenes si se proporcionan
        if (imagenes != null && !imagenes.isEmpty()) {
            try {
                // Crear el directorio si no existe
                Path uploadDir = Paths.get(uploadPath);
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    System.out.println("✅ Directorio de uploads creado: " + uploadDir.toAbsolutePath());
                }
                
                int orden = mascotaExistente.getImagenes().size() + 1;
                
                for (MultipartFile file : imagenes) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path destinoPath = uploadDir.resolve(fileName);
                        File destino = destinoPath.toFile();
                        
                        file.transferTo(destino);
                        System.out.println("✅ Nueva imagen guardada: " + destino.getAbsolutePath());

                        MascotaImage img = new MascotaImage();
                        img.setImagenPath(destino.getAbsolutePath());
                        img.setOrden(orden++);
                        img.setMascota(mascotaExistente);
                        mascotaExistente.getImagenes().add(img);

                    } catch (IOException e) {
                        System.err.println("❌ Error guardando imagen: " + e.getMessage());
                        throw new IllegalArgumentException("Error al guardar imagen: " + e.getMessage());
                    }
                }
            } catch (IOException e) {
                System.err.println("❌ Error creando directorio de uploads: " + e.getMessage());
                throw new IllegalArgumentException("Error al crear directorio de uploads: " + e.getMessage());
            }
        }

        // Guardar y retornar la mascota actualizada
        Mascotas mascotaGuardada = mascotasRepository.save(mascotaExistente);
        System.out.println("✅ Mascota actualizada exitosamente");
        System.out.println("=== SERVICE: FIN actualización ===\n");
        
        return mascotaMapper.toDTO(mascotaGuardada);
    }

    @Override
    @Transactional
    public void eliminarMascota(Long id) {
        System.out.println("\n=== SERVICE: Eliminando mascota ID " + id + " (SIN validación de usuario) ===");
        
        // Buscar la mascota para obtener sus imágenes
        Mascotas mascota = mascotasRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + id));
        
        System.out.println("✅ Mascota encontrada: " + mascota.getNombre());
        System.out.println("📸 Imágenes asociadas: " + mascota.getImagenes().size());
        
        // Eliminar archivos físicos de imágenes
        for (MascotaImage img : mascota.getImagenes()) {
            try {
                File archivo = new File(img.getImagenPath());
                if (archivo.exists()) {
                    boolean eliminado = archivo.delete();
                    if (eliminado) {
                        System.out.println("✅ Imagen eliminada: " + img.getImagenPath());
                    } else {
                        System.err.println("⚠️ No se pudo eliminar: " + img.getImagenPath());
                    }
                } else {
                    System.out.println("ℹ️ Archivo no existe: " + img.getImagenPath());
                }
            } catch (Exception e) {
                System.err.println("❌ Error eliminando imagen: " + e.getMessage());
            }
        }
        
        // Eliminar la mascota de la base de datos (cascade eliminará las referencias de imágenes)
        mascotasRepository.deleteById(id);
        
        System.out.println("✅ Mascota eliminada de la BD");
        System.out.println("=== SERVICE: FIN eliminación ===\n");
    }

    @Override
    @Transactional
    public void eliminarMascotaPorUsuario(Long id, Person usuario) {
        System.out.println("\n=== SERVICE: Eliminando mascota ID " + id + " por usuario " + usuario.getIdPerson() + " ===");
        
        // Buscar la mascota para validar permisos
        Mascotas mascota = mascotasRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + id));
        
        System.out.println("✅ Mascota encontrada: " + mascota.getNombre());
        System.out.println("👤 Dueño de la mascota: " + mascota.getALIADO().getEmail());
        System.out.println("👤 Usuario solicitante: " + usuario.getEmail());
        
        // Verificar permisos: ADMIN puede eliminar todas, ALIADO solo las suyas
        boolean esAdmin = usuario.getRole() != null && 
                        usuario.getRole().getRoleType() == Role.RoleType.ADMIN;
        
        Long idDueno = mascota.getALIADO().getIdPerson();
        Long idUsuarioActual = usuario.getIdPerson();
        
        if (!esAdmin && !idDueno.equals(idUsuarioActual)) {
            System.err.println("❌ Usuario " + idUsuarioActual + " no es el dueño de la mascota (dueño: " + idDueno + ")");
            throw new SecurityException("No tienes permisos para eliminar esta mascota");
        }
        
        System.out.println("✅ Usuario autorizado para eliminar" + (esAdmin ? " (ADMIN)" : " (dueño)"));
        
        // Llamar al método principal de eliminación
        eliminarMascota(id);
    }

    @Override
    @Transactional
    public void eliminarImagen(Long mascotaId, Long imagenId) {
        System.out.println("\n=== SERVICE: Eliminando imagen ID " + imagenId + " de mascota ID " + mascotaId + " ===");
        
        // Buscar la mascota
        Mascotas mascota = mascotasRepository.findById(mascotaId)
                .orElseThrow(() -> new IllegalArgumentException("Mascota no encontrada con ID: " + mascotaId));
        
        System.out.println("✅ Mascota encontrada: " + mascota.getNombre());
        System.out.println("📸 Total de imágenes: " + mascota.getImagenes().size());
        
        // Buscar la imagen específica
        MascotaImage imagenAEliminar = mascota.getImagenes().stream()
                .filter(img -> img.getId().equals(imagenId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Imagen no encontrada con ID: " + imagenId));
        
        System.out.println("✅ Imagen encontrada: " + imagenAEliminar.getImagenPath());
        
        // Eliminar archivo físico
        try {
            File archivo = new File(imagenAEliminar.getImagenPath());
            if (archivo.exists()) {
                boolean eliminado = archivo.delete();
                if (eliminado) {
                    System.out.println("✅ Archivo físico eliminado: " + imagenAEliminar.getImagenPath());
                } else {
                    System.err.println("⚠️ No se pudo eliminar el archivo: " + imagenAEliminar.getImagenPath());
                }
            } else {
                System.out.println("ℹ️ Archivo físico no existe: " + imagenAEliminar.getImagenPath());
            }
        } catch (Exception e) {
            System.err.println("❌ Error eliminando archivo físico: " + e.getMessage());
        }
        
        // Remover imagen de la lista de la mascota
        mascota.getImagenes().remove(imagenAEliminar);
        
        // Guardar cambios (cascade eliminará el registro de la BD)
        mascotasRepository.save(mascota);
        
        System.out.println("✅ Imagen eliminada de la BD");
        System.out.println("📸 Imágenes restantes: " + mascota.getImagenes().size());
        System.out.println("=== SERVICE: FIN eliminación de imagen ===\n");
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotasDTO> listarMascotasPorUsuario(com.example.AdoptaFacil.Entity.Person usuario) {
        System.out.println("\n=== SERVICE: Listando mascotas por usuario ===");
        System.out.println("Usuario ID: " + usuario.getIdPerson() + ", Email: " + usuario.getEmail());
        
        // Usar consulta con JOIN FETCH para evitar LazyInitializationException
        List<Mascotas> mascotas = mascotasRepository.findByALIADOWithImages(usuario);
        System.out.println("Mascotas encontradas: " + mascotas.size());
        
        List<MascotasDTO> resultado = mascotas.stream()
                .map(mascotaMapper::toDTO)
                .toList();
                
        System.out.println("=== SERVICE: FIN listado por usuario ===\n");
        return resultado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotasDTO> buscarPorNombreYUsuario(String nombre, com.example.AdoptaFacil.Entity.Person usuario) {
        System.out.println("\n=== SERVICE: Buscando mascotas por nombre y usuario ===");
        System.out.println("Nombre: " + nombre + ", Usuario ID: " + usuario.getIdPerson());
        
        // Usar consulta con JOIN FETCH para evitar LazyInitializationException
        List<Mascotas> mascotas = mascotasRepository.findByNombreContainingIgnoreCaseAndALIADOWithImages(nombre, usuario);
        System.out.println("Mascotas encontradas: " + mascotas.size());
        
        List<MascotasDTO> resultado = mascotas.stream()
                .map(mascotaMapper::toDTO)
                .toList();
                
        System.out.println("=== SERVICE: FIN búsqueda por nombre y usuario ===\n");
        return resultado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MascotasDTO> listarTodasLasMascotasConPropietario() {
        System.out.println("\n=== SERVICE: Listando TODAS las mascotas con propietario ===");
        
        // Usar consulta con JOIN FETCH para cargar imágenes y propietario de forma anticipada
        List<Mascotas> mascotas = mascotasRepository.findAllWithImagesAndOwner();
        System.out.println("Total de mascotas en el sistema: " + mascotas.size());
        
        List<MascotasDTO> resultado = mascotas.stream()
                .map(mascotaMapper::toDTOConPropietario)
                .toList();
                
        System.out.println("=== SERVICE: FIN listado completo ===\n");
        return resultado;
    }
}




