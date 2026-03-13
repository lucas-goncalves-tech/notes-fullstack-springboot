package com.notesapi.notes_api.note;


import com.notesapi.notes_api.note.entities.Note;
import com.notesapi.notes_api.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findAllByUser(User user);

    Optional<Note> findByIdAndUser(UUID id, User user);
}
