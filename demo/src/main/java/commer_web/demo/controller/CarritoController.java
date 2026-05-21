package commer_web.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.dto.AgregarCarritoRequest;
import commer_web.demo.model.Carrito;
import commer_web.demo.model.CarritoDetalle;
import commer_web.demo.model.Cliente;
import commer_web.demo.model.ProductoVariante;
import commer_web.demo.repository.CarritoDetalleRepository;
import commer_web.demo.repository.CarritoRepository;
import commer_web.demo.repository.ClienteRepository;
import commer_web.demo.repository.ProductoVarianteRepository;

@RestController
@RequestMapping("/api/carritos")
@CrossOrigin(origins = "http://localhost:4200")
public class CarritoController {

    private final CarritoRepository carritoRepository;
    private final CarritoDetalleRepository carritoDetalleRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoVarianteRepository varianteRepository;

    public CarritoController(
            CarritoRepository carritoRepository,
            CarritoDetalleRepository carritoDetalleRepository,
            ClienteRepository clienteRepository,
            ProductoVarianteRepository varianteRepository
    ) {
        this.carritoRepository = carritoRepository;
        this.carritoDetalleRepository = carritoDetalleRepository;
        this.clienteRepository = clienteRepository;
        this.varianteRepository = varianteRepository;
    }

    @GetMapping("/cliente/{clienteId}")
    public Carrito obtenerCarritoPorCliente(@PathVariable Long clienteId) {
        return carritoRepository.findByClienteIdAndActivoTrue(clienteId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    }

    @PostMapping("/agregar")
    public Carrito agregarProducto(@RequestBody AgregarCarritoRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        ProductoVariante variante = varianteRepository.findById(request.getVarianteId())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a cero");
        }

        if (variante.getStock() < request.getCantidad()) {
            throw new RuntimeException("Stock insuficiente para la variante seleccionada");
        }

        Carrito carrito = carritoRepository.findByClienteIdAndActivoTrue(request.getClienteId())
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setCliente(cliente);
                    return carritoRepository.save(nuevo);
                });

        CarritoDetalle detalleExistente = carrito.getDetalles().stream()
                .filter(detalle ->
                        detalle.getVariante() != null &&
                        detalle.getVariante().getId().equals(variante.getId())
                )
                .findFirst()
                .orElse(null);

        if (detalleExistente != null) {
            int nuevaCantidad = detalleExistente.getCantidad() + request.getCantidad();

            if (variante.getStock() < nuevaCantidad) {
                throw new RuntimeException("Stock insuficiente para la variante seleccionada");
            }

            detalleExistente.setCantidad(nuevaCantidad);
        } else {
            CarritoDetalle detalle = new CarritoDetalle(variante, request.getCantidad());
            carrito.agregarDetalle(detalle);
        }

        return carritoRepository.save(carrito);
    }

    @DeleteMapping("/detalle/{detalleId}")
    public void eliminarDetalle(@PathVariable Long detalleId) {
        carritoDetalleRepository.deleteById(detalleId);
    }
}
