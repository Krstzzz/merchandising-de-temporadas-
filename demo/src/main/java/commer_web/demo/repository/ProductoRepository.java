package commer_web.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaId(Long categoriaId);

    List<Producto> findBySubcategoriaContainingIgnoreCase(String subcategoria);

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
