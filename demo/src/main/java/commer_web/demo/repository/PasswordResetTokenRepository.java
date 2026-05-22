package commer_web.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import commer_web.demo.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findTopByEmailAndTokenAndUsadoFalseOrderByFechaCreacionDesc(
            String email,
            String token
    );
}