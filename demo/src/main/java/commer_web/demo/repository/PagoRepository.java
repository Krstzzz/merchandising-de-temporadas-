package commer_web.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Long> {
}
