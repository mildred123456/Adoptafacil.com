package com.example.AdoptaFacil.Service;

import com.example.AdoptaFacil.Entity.Solicitudes;
import java.util.List;

public interface SolicitudesService {
    Solicitudes crearSolicitud(Solicitudes solicitud);
    List<Solicitudes> listarSolicitudes();
    Solicitudes cambiarEstado(Long id, String nuevoEstado, String comentario);
}
