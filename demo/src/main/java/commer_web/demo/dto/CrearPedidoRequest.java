package commer_web.demo.dto;

import commer_web.demo.model.MetodoPago;

public class CrearPedidoRequest {

    private String direccionEnvio;
    private MetodoPago metodoPago;

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }
}
