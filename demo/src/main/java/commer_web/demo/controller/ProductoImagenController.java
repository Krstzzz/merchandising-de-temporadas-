package commer_web.demo.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import commer_web.demo.model.Producto;
import commer_web.demo.model.ProductoImagen;
import commer_web.demo.repository.ProductoImagenRepository;
import commer_web.demo.repository.ProductoRepository;

@RestController
@RequestMapping("/api/producto-imagenes")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoImagenController {

    private final ProductoImagenRepository imagenRepository;
    private final ProductoRepository productoRepository;

    public ProductoImagenController(
            ProductoImagenRepository imagenRepository,
            ProductoRepository productoRepository
    ) {
        this.imagenRepository = imagenRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping("/producto/{productoId}")
    public List<ProductoImagen> listarPorProducto(@PathVariable Long productoId) {
        return imagenRepository.findByProductoIdOrderByOrdenAsc(productoId);
    }

    @PostMapping(value = "/subir", consumes = "multipart/form-data")
    public ProductoImagen subirImagen(
            @RequestParam Long productoId,
            @RequestParam(required = false) String colorHex,
            @RequestParam(defaultValue = "false") Boolean principal,
            @RequestParam(defaultValue = "0") Integer orden,
            @RequestPart("imagen") MultipartFile imagen
    ) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        String imagenUrl = guardarImagen(imagen);

        ProductoImagen productoImagen = new ProductoImagen();
        productoImagen.setProducto(producto);
        productoImagen.setImagenUrl(imagenUrl);
        productoImagen.setColorHex(colorHex);
        productoImagen.setPrincipal(principal);
        productoImagen.setOrden(orden);

        return imagenRepository.save(productoImagen);
    }

    @DeleteMapping("/{id}")
    public void eliminarImagen(@PathVariable Long id) {
        imagenRepository.deleteById(id);
    }

    private String guardarImagen(MultipartFile imagen) {
        try {
            if (imagen == null || imagen.isEmpty()) {
                throw new RuntimeException("La imagen es obligatoria");
            }

            String contentType = imagen.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("El archivo debe ser una imagen");
            }

            Path uploadPath = Paths.get("uploads/productos");
            Files.createDirectories(uploadPath);

            String original = imagen.getOriginalFilename();
            String extension = "";

            if (original != null && original.contains(".")) {
                extension = original.substring(original.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(imagen.getInputStream(), filePath);

            return "/uploads/productos/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("No se pudo guardar la imagen: " + e.getMessage());
        }
    }
}
