package com.notesapi.notes_api.note.dtos;

import com.notesapi.notes_api.note.entities.Note;

import java.time.LocalDateTime;

public record NoteResponse(
        String title,
        String content,
        boolean completed,
        LocalDateTime createdAt
) {
    public static NoteResponse fromEntity(Note note) {
        return new NoteResponse(
                note.getTitle(),
                note.getContent(),
                note.isCompleted(),
                note.getCreatedAt()
        );
    }
}
