package com.notesapi.notes_api.note;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notesapi.notes_api.helpers.TestNoteHelper;
import com.notesapi.notes_api.helpers.TestUserHelper;
import com.notesapi.notes_api.user.entities.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@Tag("integration")
@DisplayName("Integration tests - Notes")
@Transactional
public class NoteControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgresSQL = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private TestUserHelper testUserHelper;

    @Autowired
    private TestNoteHelper testNoteHelper;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String notesUrl = "/notes";

    private MultiValueMap<String, String> pageParams(int page, int size) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("page", String.valueOf(page));
        params.add("size", String.valueOf(size));
        return params;
    }

    @Nested
    @DisplayName("GET: /notes")
    class GetNotes {

        @Test
        @DisplayName("Should return all notes from user when authenticated")
        void shouldReturnAllNotesFromUser_WhenAuthenticated() throws Exception {
            User user = testUserHelper.createUser();
            testNoteHelper.createNote(user);
            testNoteHelper.createNote(user);
            testNoteHelper.createNote(user);

            mockMvc.perform(get(notesUrl)
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content", hasSize(3)))
                    .andExpect(jsonPath("$.page").exists())
                    .andExpect(jsonPath("$.size").exists())
                    .andExpect(jsonPath("$.totalElements").exists())
                    .andExpect(jsonPath("$.totalPages").exists())
                    .andExpect(jsonPath("$.isLast").isBoolean());
        }

        @Test
        @DisplayName("Should return all notes with pagination from user when authenticated")
        void shouldReturnAllNotesWithPaginationFromUser_WhenAuthenticated() throws Exception {
            User user = testUserHelper.createUser();
            for (int i = 0; i < 10; i++) {
                testNoteHelper.createNote(user);
            }

            mockMvc.perform(get(notesUrl)
                            .queryParams(pageParams(1, 5))
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content", hasSize(5)))
                    .andExpect(jsonPath("$.page").value(1))
                    .andExpect(jsonPath("$.size").value(5))
                    .andExpect(jsonPath("$.totalElements").value(10))
                    .andExpect(jsonPath("$.totalPages").value(2))
                    .andExpect(jsonPath("$.isLast").value(true));
        }

        @Test
        @DisplayName("Should return note with title searched when authenticated")
        void shouldReturnNoteWithTitleSearched_WhenAuthenticated() throws Exception {
            User user = testUserHelper.createUser();
            String title = "search by this note";
            for (int i = 0; i < 4; i++) {
                testNoteHelper.createNote(user);
            }
            testNoteHelper.title(title).createNote(user);

            mockMvc.perform(get(notesUrl)
                            .queryParam("title", title)
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content", hasSize(1)))
                    .andExpect(jsonPath("$.content[0].title", containsString(title)))
                    .andExpect(jsonPath("$.page").value(0))
                    .andExpect(jsonPath("$.size").value(10))
                    .andExpect(jsonPath("$.totalElements").value(1))
                    .andExpect(jsonPath("$.totalPages").value(1))
                    .andExpect(jsonPath("$.isLast").value(true));
        }

        @Test
        @DisplayName("Should return empty content when page is out of bounds")
        void shouldReturnEmptyContent_WhenPageIsOutOfBounds() throws Exception {
            User user = testUserHelper.createUser();
            testNoteHelper.createNote(user);

            mockMvc.perform(get(notesUrl)
                            .queryParams(pageParams(99, 10))
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content", hasSize(0)))
                    .andExpect(jsonPath("$.totalElements").value(1));
        }

        @Test
        @DisplayName("Should return empty content when title is not found")
        void shouldReturnEmptyContent_WhenTitleNotFound() throws Exception {
            User user = testUserHelper.createUser();
            testNoteHelper.createNote(user);

            mockMvc.perform(get(notesUrl)
                            .queryParam("title", "this title does not exist")
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content", hasSize(0)))
                    .andExpect(jsonPath("$.totalElements").value(0));
        }

        @Test
        @DisplayName("Should normalize page to 0 when page is negative")
        void shouldNormalizePage_WhenPageIsNegative() throws Exception {
            User user = testUserHelper.createUser();

            mockMvc.perform(get(notesUrl)
                            .queryParams(pageParams(-1, 10))
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.page").value(0));
        }

        @Test
        @DisplayName("Should normalize size to default when size is 0")
        void shouldNormalizeSize_WhenSizeIs0() throws Exception {
            User user = testUserHelper.createUser();

            mockMvc.perform(get(notesUrl)
                            .queryParams(pageParams(0, 0))
                            .with(user(user)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.size").value(10));
        }

        @Test
        @DisplayName("Should return status 401 when non authenticated")
        void shouldReturnStatus401_WhenNonAuthenticated() throws Exception {
            mockMvc.perform(get(notesUrl))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.error").exists())
                    .andExpect(jsonPath("$.timestamp").exists());
        }
    }

}
