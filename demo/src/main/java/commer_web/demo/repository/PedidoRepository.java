package commer_web.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteId(Long clienteId);
}
