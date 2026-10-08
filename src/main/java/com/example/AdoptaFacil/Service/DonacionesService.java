package com.example.AdoptaFacil.Service;

import java.util.List;

import com.example.AdoptaFacil.DTO.DonacionesDTO;

public interface DonacionesService {

    DonacionesDTO crearDonacion(DonacionesDTO donacionDTO);

    List<DonacionesDTO> listarDonaciones();

    DonacionesDTO obtenerDonacionPorId(Long id);

    List<DonacionesDTO> obtenerDonacionesPorDonante(Long donanteId);

    void eliminarDonacion(Long id);
}
