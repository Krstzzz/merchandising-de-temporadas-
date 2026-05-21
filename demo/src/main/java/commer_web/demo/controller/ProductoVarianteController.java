package commer_web.demo.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.model.Producto;
import commer_web.demo.model.ProductoVariante;
import commer_web.demo.repository.ProductoRepository;
import commer_web.demo.repository.ProductoVarianteRepository;

@RestController
@RequestMapping("/api/producto-variantes")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoVarianteController {

    private final ProductoVarianteRepository varianteRepository;
    private final ProductoRepository productoRepository;

    public ProductoVarianteController(
            ProductoVarianteRepository varianteRepository,
            ProductoRepository productoRepository
    ) {
        this.varianteRepository = varianteRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping("/producto/{productoId}")
    public List<ProductoVariante> listarPorProducto(@PathVariable Long productoId) {
        return varianteRepository.findByProductoId(productoId);
    }

    @PostMapping
    public ProductoVariante crearVariante(@RequestBody VarianteRequest request) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        ProductoVariante variante = new ProductoVariante();
        variante.setProducto(producto);
        variante.setColorHex(request.getColorHex());
        variante.setTalla(request.getTalla());
        variante.setStock(request.getStock());
        variante.setPrecio(request.getPrecio());
        variante.setSku(request.getSku());

        ProductoVariante varianteGuardada = varianteRepository.save(variante);
        actualizarStockTotalProducto(producto.getId());

        return varianteGuardada;
    }

    @DeleteMapping("/{id}")
    public void eliminarVariante(@PathVariable Long id) {
        ProductoVariante variante = varianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));

        Long productoId = variante.getProducto().getId();

        varianteRepository.deleteById(id);
        actualizarStockTotalProducto(productoId);
    }

    private void actualizarStockTotalProducto(Long productoId) {
        int stockTotal = varianteRepository.findByProductoId(productoId)
                .stream()
                .mapToInt(ProductoVariante::getStock)
                .sum();

        productoRepository.findById(productoId).ifPresent(producto -> {
            producto.setStock(stockTotal);
            productoRepository.save(producto);
        });
    }

    public static class VarianteRequest {

        private Long productoId;
        private String colorHex;
        private String talla;
        private Integer stock;
        private BigDecimal precio;
        private String sku;

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public String getColorHex() {
            return colorHex;
        }

        public void setColorHex(String colorHex) {
            this.colorHex = colorHex;
        }

        public String getTalla() {
            return talla;
        }

        public void setTalla(String talla) {
            this.talla = talla;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }

        public BigDecimal getPrecio() {
            return precio;
        }

        public void setPrecio(BigDecimal precio) {
            this.precio = precio;
        }

        public String getSku() {
            return sku;
        }

        public void setSku(String sku) {
            this.sku = sku;
        }
    }
}
