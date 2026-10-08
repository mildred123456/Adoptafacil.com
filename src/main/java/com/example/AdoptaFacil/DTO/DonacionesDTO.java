package com.example.AdoptaFacil.DTO;

import java.time.LocalDateTime;

public class DonacionesDTO {

    private Long id;
    private Long donanteId;      // ID del usuario que dona
    private Double monto;
    private String metodoPago;
    private LocalDateTime fechaDonacion;
    private String comentario;

    // Constructor vacío
    public DonacionesDTO() {}

    // Constructor con parámetros
    public DonacionesDTO(Long id, Long donanteId, Double monto, String metodoPago, LocalDateTime fechaDonacion, String comentario) {
        this.id = id;
        this.donanteId = donanteId;
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.fechaDonacion = fechaDonacion;
        this.comentario = comentario;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDonanteId() {
        return donanteId;
    }

    public void setDonanteId(Long donanteId) {
        this.donanteId = donanteId;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public LocalDateTime getFechaDonacion() {
        return fechaDonacion;
    }

    public void setFechaDonacion(LocalDateTime fechaDonacion) {
        this.fechaDonacion = fechaDonacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
