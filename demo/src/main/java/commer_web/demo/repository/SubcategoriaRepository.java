package commer_web.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Subcategoria;

public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    List<Subcategoria> findByCategoriaId(Long categoriaId);
}
