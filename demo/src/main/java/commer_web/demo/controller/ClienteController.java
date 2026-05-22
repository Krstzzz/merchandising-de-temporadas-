package commer_web.demo.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import commer_web.demo.dto.CambiarPasswordRequest;
import commer_web.demo.dto.LoginRequest;
import commer_web.demo.dto.RestablecerPasswordRequest;
import commer_web.demo.dto.SolicitarRecuperacionPasswordRequest;
import commer_web.demo.model.Cliente;
import commer_web.demo.model.PasswordResetToken;
import commer_web.demo.repository.ClienteRepository;
import commer_web.demo.repository.PasswordResetTokenRepository;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final PasswordResetTokenRepository resetTokenRepository;

    public ClienteController(
            ClienteRepository clienteRepository,
            PasswordResetTokenRepository resetTokenRepository) {
        this.clienteRepository = clienteRepository;
        this.resetTokenRepository = resetTokenRepository;
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

    @PostMapping("/solicitar-recuperacion")
    public Map<String, String> solicitarRecuperacion(
            @RequestBody SolicitarRecuperacionPasswordRequest request) {
        Cliente cliente = clienteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No existe un cliente con ese correo"));

        String token = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(cliente.getEmail());
        resetToken.setToken(token);
        resetToken.setFechaExpiracion(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsado(false);
        resetTokenRepository.save(resetToken);

        System.out.println("Token de recuperación para " + cliente.getEmail() + ": " + token);

        return Map.of(
                "mensaje", "Token generado correctamente. En la siguiente fase se enviará por correo.",
                "token", token);
    }

    @PutMapping("/restablecer-password")
    public Cliente restablecerPassword(@RequestBody RestablecerPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository
                .findTopByEmailAndTokenAndUsadoFalseOrderByFechaCreacionDesc(
                        request.getEmail(),
                        request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido o ya usado"));

        if (resetToken.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token ha expirado");
        }

        if (request.getPasswordNuevo() == null || request.getPasswordNuevo().length() < 8) {
            throw new RuntimeException("La nueva contraseña debe tener mínimo 8 caracteres");
        }

        Cliente cliente = clienteRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setPassword(request.getPasswordNuevo());
        resetToken.setUsado(true);
        resetTokenRepository.save(resetToken);

        return clienteRepository.save(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizarCliente(@PathVariable Long id, @RequestBody Cliente datos) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombre(datos.getNombre());
        cliente.setApellido(datos.getApellido());
        cliente.setEmail(datos.getEmail());
        cliente.setTelefono(datos.getTelefono());
        cliente.setDireccion(datos.getDireccion());

        if (datos.getActivo() != null) {
            cliente.setActivo(datos.getActivo());
        }

        return clienteRepository.save(cliente);
    }

    @PutMapping("/{id}/password")
    public Cliente cambiarPassword(
            @PathVariable Long id,
            @RequestBody CambiarPasswordRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (request.getPasswordActual() == null || request.getPasswordActual().isBlank()) {
            throw new RuntimeException("Ingresa tu contraseña actual");
        }

        if (!cliente.getPassword().equals(request.getPasswordActual())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        if (request.getPasswordNuevo() == null || request.getPasswordNuevo().length() < 8) {
            throw new RuntimeException("La nueva contraseña debe tener mínimo 8 caracteres");
        }

        cliente.setPassword(request.getPasswordNuevo());
        return clienteRepository.save(cliente);
    }

    @DeleteMapping("/{id}")
    public void eliminarCliente(@PathVariable Long id) {
        clienteRepository.deleteById(id);
    }
}
