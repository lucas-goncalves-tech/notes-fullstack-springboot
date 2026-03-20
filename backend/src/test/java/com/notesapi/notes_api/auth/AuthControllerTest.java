package com.notesapi.notes_api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notesapi.notes_api.auth.dtos.RegisterRequest;
import com.notesapi.notes_api.user.UserRepository;
import com.notesapi.notes_api.user.entities.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Tag("integration")
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class AuthControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("Endpoint: /auth/register")
    class RegisterEndpoint {

        final static String authUrl = "/auth/register";

        @Test
        @DisplayName("Should return status 201 and create a new user when request is valid")
        void shouldReturnStatus201AndCreateANewUser_WhenRequestIsValid() throws Exception {
            String email = "test@test.com";
            String password = "test123123";
            String displayName = "test";
            RegisterRequest request = new RegisterRequest(email, displayName, password, password);
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(authUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.data.email").value(email))
                    .andExpect(jsonPath("$.data.displayName").value(displayName));

            Optional<User> savedUser = userRepository.findByEmail(email);
            assertTrue(savedUser.isPresent());
            assertNotEquals(password, savedUser.get().getPassword());
        }

        @Test
        @DisplayName("Should return status 400 when request is not valid")
        void shouldReturnStatus400_WhenRequestIsNotValid() throws Exception {
            String invalidEmail = "testiest";
            String shortPassword = "123";
            String shortDisplayName = "ab";
            RegisterRequest request = new RegisterRequest(invalidEmail, shortDisplayName, shortPassword, shortPassword);
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(authUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.details", hasItem(containsString("email"))))
                    .andExpect(jsonPath("$.details", hasItem(containsString("displayName"))))
                    .andExpect(jsonPath("$.details", hasItem(containsString("password"))))
                    .andExpect(jsonPath("$.details", hasItem(containsString("confirmPassword"))));
        }

        @Test
        @DisplayName("Should return status 409 when email already exist")
        void shouldReturnStatus409_WhenEmailAlreadyExist() throws Exception {
            String existEmail = "test@test.com";
            User newUser = User.builder()
                    .email(existEmail)
                    .displayName("username")
                    .password("123123123").build();
            userRepository.save(newUser);
            RegisterRequest request = new RegisterRequest(existEmail, "username", "123123123", "123123123");
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(authUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").exists());
        }
    }
}
