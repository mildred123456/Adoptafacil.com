package com.example.AdoptaFacil.Implement;

import com.example.AdoptaFacil.Service.DonacionesService;
import com.example.AdoptaFacil.DTO.DonacionesDTO;
import com.example.AdoptaFacil.Entity.Donaciones;
import com.example.AdoptaFacil.Entity.Person;
import com.example.AdoptaFacil.Repository.DonacionesRepository;
import com.example.AdoptaFacil.Repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonacionesServiceImpl implements DonacionesService {

    @Autowired
    private DonacionesRepository donacionesRepository;

    @Autowired
    private PersonRepository personRepository;

    @Override
    public DonacionesDTO crearDonacion(DonacionesDTO donacionDTO) {
        Person donante = personRepository.findById(donacionDTO.getDonanteId())
                .orElseThrow(() -> new RuntimeException("Donante no encontrado"));

        Donaciones donacion = new Donaciones(
                donante,
                donacionDTO.getMonto(),
                donacionDTO.getMetodoPago(),
                donacionDTO.getFechaDonacion(),
                donacionDTO.getComentario()
        );

        Donaciones saved = donacionesRepository.save(donacion);

        return new DonacionesDTO(
                saved.getId(),
                saved.getDonante().getIdPerson(),
                saved.getMonto(),
                saved.getMetodoPago(),
                saved.getFechaDonacion(),
                saved.getComentario()
        );
    }

    @Override
    public List<DonacionesDTO> listarDonaciones() {
        return donacionesRepository.findAll().stream()
                .map(d -> new DonacionesDTO(
                        d.getId(),
                        d.getDonante().getIdPerson(),
                        d.getMonto(),
                        d.getMetodoPago(),
                        d.getFechaDonacion(),
                        d.getComentario()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public DonacionesDTO obtenerDonacionPorId(Long id) {
        Donaciones d = donacionesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));

        return new DonacionesDTO(
                d.getId(),
                d.getDonante().getIdPerson(),
                d.getMonto(),
                d.getMetodoPago(),
                d.getFechaDonacion(),
                d.getComentario()
        );
    }

    @Override
    public List<DonacionesDTO> obtenerDonacionesPorDonante(Long donanteId) {
        Person donante = personRepository.findById(donanteId)
                .orElseThrow(() -> new RuntimeException("Donante no encontrado"));

        return donacionesRepository.findByDonante(donante).stream()
                .map(d -> new DonacionesDTO(
                        d.getId(),
                        d.getDonante().getIdPerson(),
                        d.getMonto(),
                        d.getMetodoPago(),
                        d.getFechaDonacion(),
                        d.getComentario()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarDonacion(Long id) {
        if (!donacionesRepository.existsById(id)) {
            throw new RuntimeException("La donación no existe");
        }
        donacionesRepository.deleteById(id);
    }
}
