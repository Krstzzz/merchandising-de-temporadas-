package commer_web.demo.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.dto.CrearPedidoRequest;
import commer_web.demo.model.Carrito;
import commer_web.demo.model.CarritoDetalle;
import commer_web.demo.model.EstadoPago;
import commer_web.demo.model.EstadoPedido;
import commer_web.demo.model.MetodoPago;
import commer_web.demo.model.Pago;
import commer_web.demo.model.Pedido;
import commer_web.demo.model.PedidoDetalle;
import commer_web.demo.model.Producto;
import commer_web.demo.repository.CarritoRepository;
import commer_web.demo.repository.PedidoRepository;
import commer_web.demo.repository.ProductoRepository;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;

    public PedidoController(
            PedidoRepository pedidoRepository,
            CarritoRepository carritoRepository,
            ProductoRepository productoRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.carritoRepository = carritoRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPedido(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Pedido> listarPedidosPorCliente(@PathVariable Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    @PostMapping("/crear-desde-carrito/{clienteId}")
    @Transactional
    public Pedido crearPedidoDesdeCarrito(
            @PathVariable Long clienteId,
            @RequestBody CrearPedidoRequest request
    ) {
        Carrito carrito = carritoRepository.findByClienteIdAndActivoTrue(clienteId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (carrito.getDetalles().isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(carrito.getCliente());
        pedido.setDireccionEnvio(request.getDireccionEnvio());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        BigDecimal total = BigDecimal.ZERO;

        for (CarritoDetalle item : carrito.getDetalles()) {
            Producto producto = item.getProducto();

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            PedidoDetalle detalle = new PedidoDetalle(
                    producto,
                    item.getCantidad(),
                    item.getTalla(),
                    item.getColor(),
                    item.getPrecioUnitario()
            );

            pedido.agregarDetalle(detalle);
            total = total.add(detalle.getSubtotal());

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);
        }

        pedido.setTotal(total);

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMetodoPago(request.getMetodoPago());
        pago.setMonto(total);

        if (request.getMetodoPago() == MetodoPago.TARJETA) {
            pago.setEstadoPago(EstadoPago.PAGADO);
            pedido.setEstado(EstadoPedido.PROCESANDO);
        } else {
            pago.setEstadoPago(EstadoPago.PENDIENTE);
            pedido.setEstado(EstadoPedido.PENDIENTE);
        }

        pedido.setPago(pago);

        carrito.setActivo(false);
        carritoRepository.save(carrito);

        return pedidoRepository.save(pedido);
    }

    @PutMapping("/{id}/estado")
    public Pedido actualizarEstadoPedido(@PathVariable Long id, @RequestParam EstadoPedido estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }
}
