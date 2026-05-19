package commer_web.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.ProductoImagen;

public interface ProductoImagenRepository extends JpaRepository<ProductoImagen, Long> {
    List<ProductoImagen> findByProductoIdOrderByOrdenAsc(Long productoId);
}
