package com.notesapi.notes_api.auth.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.notesapi.notes_api.user.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    public String generate(User user) {
        try {
            return JWT.create()
                    .withIssuer("notes-api")
                    .withSubject(user.getEmail())
                    .withClaim("id", user.getId().toString())
                    .withExpiresAt(generateExpiresAt())
                    .sign(Algorithm.HMAC256(secret));
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error ao gerar JWT", exception);
        }
    }

    private Instant generateExpiresAt() {
        return LocalDateTime.now().plusHours(3).toInstant(ZoneOffset.of("-03:00"));
    }
}
