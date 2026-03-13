package com.notesapi.notes_api.note.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateNoteRequest(
        @NotBlank
        @Size(min = 4, message = "Titulo deve ser no minimo 4 characteres")
        String title,

        @NotBlank
        @Size(min = 10, message = "Conteudo deve ter no minimo 10 caracteres")
        String content
) {
}
