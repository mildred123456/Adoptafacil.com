package com.example.AdoptaFacil.Repository;


import com.example.AdoptaFacil.Entity.MascotaImage;
import com.example.AdoptaFacil.Entity.Mascotas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MascotaImageRepository extends JpaRepository<MascotaImage, Long> {
    List<MascotaImage> findByMascotaOrderByOrden(Mascotas mascota);
}
