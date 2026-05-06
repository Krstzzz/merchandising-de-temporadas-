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

import commer_web.demo.model.Admin;
import commer_web.demo.repository.AdminRepository;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public List<Admin> listarAdmins() {
        return adminRepository.findAll();
    }

    @GetMapping("/{id}")
    public Admin obtenerAdmin(@PathVariable Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
    }

    @PostMapping
    public Admin crearAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    @PutMapping("/{id}")
    public Admin actualizarAdmin(@PathVariable Long id, @RequestBody Admin datos) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

        admin.setNombre(datos.getNombre());
        admin.setApellido(datos.getApellido());
        admin.setEmail(datos.getEmail());
        admin.setPassword(datos.getPassword());
        admin.setRol(datos.getRol());
        admin.setActivo(datos.getActivo());

        return adminRepository.save(admin);
    }

    @DeleteMapping("/{id}")
    public void eliminarAdmin(@PathVariable Long id) {
        adminRepository.deleteById(id);
    }
}
