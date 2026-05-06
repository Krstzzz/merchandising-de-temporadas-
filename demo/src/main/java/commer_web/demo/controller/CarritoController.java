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
import commer_web.demo.model.Producto;
import commer_web.demo.repository.CarritoDetalleRepository;
import commer_web.demo.repository.CarritoRepository;
import commer_web.demo.repository.ClienteRepository;
import commer_web.demo.repository.ProductoRepository;

@RestController
@RequestMapping("/api/carritos")
@CrossOrigin(origins = "http://localhost:4200")
public class CarritoController {

    private final CarritoRepository carritoRepository;
    private final CarritoDetalleRepository carritoDetalleRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    public CarritoController(
            CarritoRepository carritoRepository,
            CarritoDetalleRepository carritoDetalleRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository
    ) {
        this.carritoRepository = carritoRepository;
        this.carritoDetalleRepository = carritoDetalleRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
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

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Carrito carrito = carritoRepository.findByClienteIdAndActivoTrue(request.getClienteId())
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setCliente(cliente);
                    return carritoRepository.save(nuevo);
                });

        CarritoDetalle detalleExistente = carrito.getDetalles().stream()
                .filter(detalle ->
                        detalle.getProducto().getId().equals(producto.getId()) &&
                        detalle.getTalla().equalsIgnoreCase(request.getTalla()) &&
                        detalle.getColor().equalsIgnoreCase(request.getColor())
                )
                .findFirst()
                .orElse(null);

        if (detalleExistente != null) {
            detalleExistente.setCantidad(detalleExistente.getCantidad() + request.getCantidad());
        } else {
            CarritoDetalle detalle = new CarritoDetalle(
                    producto,
                    request.getCantidad(),
                    request.getTalla(),
                    request.getColor(),
                    producto.getPrecio()
            );
            carrito.agregarDetalle(detalle);
        }

        return carritoRepository.save(carrito);
    }

    @DeleteMapping("/detalle/{detalleId}")
    public void eliminarDetalle(@PathVariable Long detalleId) {
        carritoDetalleRepository.deleteById(detalleId);
    }
}
