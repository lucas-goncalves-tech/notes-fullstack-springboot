package com.notesapi.notes_api.note.dtos;

public record UpdateNoteRequest(
        String title,
        String content
) {
    public UpdateNoteRequest {
        title = title != null ? title.trim() : null;
        content = content != null ? content.trim() : null;
    }
}
