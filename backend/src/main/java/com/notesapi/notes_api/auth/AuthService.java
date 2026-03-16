package com.notesapi.notes_api.auth;

import com.notesapi.notes_api.auth.dtos.AuthTokens;
import com.notesapi.notes_api.auth.dtos.LoginRequest;
import com.notesapi.notes_api.auth.security.TokenService;
import com.notesapi.notes_api.exceptions.UnauthorizedException;
import com.notesapi.notes_api.user.UserRepository;
import com.notesapi.notes_api.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public AuthTokens login(LoginRequest data) {
        var emailPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        Authentication auth = authenticationManager.authenticate(emailPassword);

        var user = (User) auth.getPrincipal();
        return new AuthTokens(tokenService.generateAccess(user), tokenService.generateRefresh(user));
    }

    public AuthTokens refresh(String refreshtoken) {
        String exceptionMessage = "Refresh token inválido ou inexistente";
        if (refreshtoken == null || refreshtoken.isEmpty()) {
            throw new UnauthorizedException("Validação de existencia");
        }
        String email = tokenService.validate(refreshtoken, TokenService.TokenType.REFRESH);

        if (email == null || email.isBlank()) {
            throw new UnauthorizedException("Validação de token");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UnauthorizedException("Validação de usuario"));

        String newAccessToken = tokenService.generateAccess(user);
        String currentRefreshToken = refreshtoken;

        if (tokenService.needsNewRefresh(refreshtoken)) {
            currentRefreshToken = tokenService.generateRefresh(user);
        }

        return new AuthTokens(
                newAccessToken,
                currentRefreshToken
        );
    }
}
