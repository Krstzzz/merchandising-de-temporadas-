package commer_web.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.dto.LoginRequest;
import commer_web.demo.model.Cliente;
import commer_web.demo.repository.ClienteRepository;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cliente obtenerCliente(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizarCliente(@PathVariable Long id, @RequestBody Cliente datos) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombre(datos.getNombre());
        cliente.setApellido(datos.getApellido());
        cliente.setEmail(datos.getEmail());
        cliente.setPassword(datos.getPassword());
        cliente.setTelefono(datos.getTelefono());
        cliente.setDireccion(datos.getDireccion());
        cliente.setActivo(datos.getActivo());

        return clienteRepository.save(cliente);
    }

    @DeleteMapping("/{id}")
    public void eliminarCliente(@PathVariable Long id) {
        clienteRepository.deleteById(id);
    }

    @PostMapping("/login")
    public Cliente login(@RequestBody LoginRequest request) {
        Cliente cliente = clienteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (!cliente.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        if (cliente.getActivo() != null && !cliente.getActivo()) {
            throw new RuntimeException("Cliente inactivo");
        }

        return cliente;
    }

}
