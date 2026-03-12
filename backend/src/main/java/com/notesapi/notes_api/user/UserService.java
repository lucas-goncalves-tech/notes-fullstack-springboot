package com.notesapi.notes_api.user;

import com.notesapi.notes_api.auth.dtos.RegisterRequest;
import com.notesapi.notes_api.auth.dtos.RegisterResponse;
import com.notesapi.notes_api.exceptions.UnauthorizedException;
import com.notesapi.notes_api.user.dto.UserResponse;
import com.notesapi.notes_api.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponse create(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new UnauthorizedException("Email já existe");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User newUser = User.builder()
                .email(request.email())
                .username(request.username())
                .passwordHash(encodedPassword)
                .build();
        userRepository.save(newUser);

        return new RegisterResponse("Usuário %s criado com sucesso".formatted(request.username()),
                UserResponse.fromEntity(newUser));
    }

}
