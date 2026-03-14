package com.notesapi.notes_api.note;

import com.notesapi.notes_api.note.dtos.*;
import com.notesapi.notes_api.user.entities.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<Page<NoteResponse>> findAll(@AuthenticationPrincipal User user,
                                                      @RequestParam(required = false) String title,
                                                      @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(noteService.findAll(user, title, pageable));
    }

    @PostMapping
    public ResponseEntity<CreateNoteResponse> create(@Valid @RequestBody CreateNoteRequest request,
                                                     @AuthenticationPrincipal User user) {

        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(request, user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UpdateNoteResponse> update(@PathVariable UUID id,
                                                     @Valid @RequestBody UpdateNoteRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.update(id, request, user));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ToggleCompletedResponse> toggleCompleted(@PathVariable UUID id,
                                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.toggleCompleted(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id,
                                       @AuthenticationPrincipal User user) {
        noteService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
