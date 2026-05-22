package commer_web.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String correoEmisor;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarTokenRecuperacion(String destino, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(correoEmisor);
        message.setTo(destino);
        message.setSubject("Recuperación de contraseña - TrendStore");
        message.setText("""
                Hola,

                Recibimos una solicitud para restablecer tu contraseña en TrendStore.

                Tu código de recuperación es: %s

                Este código vence en 15 minutos. Si tú no solicitaste este cambio, ignora este correo.

                TrendStore
                """.formatted(token));

        mailSender.send(message);
    }
}