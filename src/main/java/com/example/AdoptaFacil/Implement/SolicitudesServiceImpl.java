package com.example.AdoptaFacil.Implement;

import com.example.AdoptaFacil.Entity.Solicitudes;
import com.example.AdoptaFacil.Repository.SolicitudesRepository;
import com.example.AdoptaFacil.Service.SolicitudesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitudesServiceImpl implements SolicitudesService {

    @Autowired
    private SolicitudesRepository solicitudesRepository;

    @Override
    public Solicitudes crearSolicitud(Solicitudes solicitud) {
        solicitud.setEstado("PENDIENTE");
        return solicitudesRepository.save(solicitud);
    }

    @Override
    public List<Solicitudes> listarSolicitudes() {
        return solicitudesRepository.findAll();
    }

    @Override
    public Solicitudes cambiarEstado(Long id, String nuevoEstado, String comentario) {
        Optional<Solicitudes> solicitudOpt = solicitudesRepository.findById(id);
        if (solicitudOpt.isPresent()) {
            Solicitudes solicitud = solicitudOpt.get();
            solicitud.setEstado(nuevoEstado);
            solicitud.setComentario(comentario);
            return solicitudesRepository.save(solicitud);
        }
        return null;
    }
}
