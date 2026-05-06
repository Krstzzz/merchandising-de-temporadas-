package commer_web.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
