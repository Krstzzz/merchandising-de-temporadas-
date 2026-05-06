package commer_web.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.dto.ProductoRequest;
import commer_web.demo.model.Categoria;
import commer_web.demo.model.Producto;
import commer_web.demo.model.ProductoColor;
import commer_web.demo.model.ProductoTalla;
import commer_web.demo.repository.CategoriaRepository;
import commer_web.demo.repository.ProductoRepository;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoController(
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository
    ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> listarPorCategoria(@PathVariable Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @GetMapping("/subcategoria")
    public List<Producto> buscarPorSubcategoria(@RequestParam String subcategoria) {
        return productoRepository.findBySubcategoriaContainingIgnoreCase(subcategoria);
    }

    @GetMapping("/{id}")
    public Producto obtenerProducto(@PathVariable Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @PostMapping
    public Producto crearProducto(@RequestBody ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setSubcategoria(request.getSubcategoria());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setCategoria(categoria);

        if (request.getTallas() != null) {
            for (String talla : request.getTallas()) {
                producto.agregarTalla(new ProductoTalla(talla, producto));
            }
        }

        if (request.getColores() != null) {
            for (String color : request.getColores()) {
                producto.agregarColor(new ProductoColor(color, producto));
            }
        }

        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setSubcategoria(request.getSubcategoria());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setCategoria(categoria);

        producto.getTallas().clear();
        if (request.getTallas() != null) {
            for (String talla : request.getTallas()) {
                producto.agregarTalla(new ProductoTalla(talla, producto));
            }
        }

        producto.getColores().clear();
        if (request.getColores() != null) {
            for (String color : request.getColores()) {
                producto.agregarColor(new ProductoColor(color, producto));
            }
        }

        return productoRepository.save(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }

}
