package com.notesapi.notes_api.auth;

import com.notesapi.notes_api.auth.dtos.RegisterRequest;
import com.notesapi.notes_api.auth.dtos.RegisterResponse;
import com.notesapi.notes_api.user.UserRepository;
import com.notesapi.notes_api.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.email())){
            throw new IllegalArgumentException("Email já existe");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User newUser = new User(request.email(), request.username(), encodedPassword);
        userRepository.save(newUser);

        return new RegisterResponse("Usuário %s criado com sucesso".formatted(request.username()),
                                    new RegisterResponse.UserDetails(request.email(), request.username()));
    }
}
