package com.notesapi.notes_api.auth.dtos;

public record RegisterResponse(
        String message,
        UserDetails data
) {
    public record UserDetails (String email, String username){}
}
