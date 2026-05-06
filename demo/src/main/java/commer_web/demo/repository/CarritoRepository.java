package commer_web.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByClienteIdAndActivoTrue(Long clienteId);
}
