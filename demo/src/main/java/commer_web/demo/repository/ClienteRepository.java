package commer_web.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);
}
