package commer_web.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
}
