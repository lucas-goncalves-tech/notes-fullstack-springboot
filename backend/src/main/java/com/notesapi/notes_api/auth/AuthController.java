package com.notesapi.notes_api.auth;

import com.notesapi.notes_api.auth.dtos.LoginRequest;
import com.notesapi.notes_api.auth.dtos.LoginResponse;
import com.notesapi.notes_api.auth.dtos.RegisterRequest;
import com.notesapi.notes_api.auth.dtos.RegisterResponse;
import com.notesapi.notes_api.auth.security.TokenService;
import com.notesapi.notes_api.user.UserService;
import com.notesapi.notes_api.user.entities.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/register")
    @Operation(summary = "Cadastra uma novo usuário")
    ResponseEntity<RegisterResponse> create(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.create(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Faz login com credenciais")
    ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        var emailPassword = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        Authentication auth = this.authenticationManager.authenticate(emailPassword);

        var user = (User) auth.getPrincipal();
        String token = this.tokenService.generate(user);

        return ResponseEntity.ok(new LoginResponse("Login realizado com sucesso!", token));
    }
}
