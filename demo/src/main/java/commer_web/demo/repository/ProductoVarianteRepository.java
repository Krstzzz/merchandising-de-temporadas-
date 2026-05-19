package commer_web.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.ProductoVariante;

public interface ProductoVarianteRepository extends JpaRepository<ProductoVariante, Long> {
    List<ProductoVariante> findByProductoId(Long productoId);
}
