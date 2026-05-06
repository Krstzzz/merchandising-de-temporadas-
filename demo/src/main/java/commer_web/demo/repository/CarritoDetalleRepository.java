package commer_web.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.CarritoDetalle;

public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Long> {
}
