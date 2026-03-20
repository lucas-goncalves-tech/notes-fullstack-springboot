package com.notesapi.notes_api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notesapi.notes_api.TestUserHelper;
import com.notesapi.notes_api.auth.dtos.LoginRequest;
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
import org.springframework.security.crypto.password.PasswordEncoder;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("Endpoint: /auth/register")
    class RegisterEndpoint {

        final static String registerUrl = "/auth/register";

        @Test
        @DisplayName("Should return status 201 and create a new user when request is valid")
        void shouldReturnStatus201AndCreateANewUser_WhenRequestIsValid() throws Exception {
            String email = "test@test.com";
            String password = "test123123";
            String displayName = "test";
            RegisterRequest request = new RegisterRequest(email, displayName, password, password);
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(registerUrl)
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

            mockMvc.perform(post(registerUrl)
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
            User user = new TestUserHelper(userRepository, passwordEncoder).createUser();
            RegisterRequest request = new RegisterRequest(user.getEmail(), "username", "123123123", "123123123");
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(registerUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").exists());
        }
    }

    @Nested
    @DisplayName("Endpoint: /auth/login")
    class LoginEndpoint {

        String loginUrl = "/auth/login";

        @Test
        @DisplayName("Should return status 200 with access on body and refresh on cookie when credentials is valid")
        void shouldReturnStatus200WithAccessOnBodyAndRefreshOnCookieWhenCredentialsIsValid() throws Exception {
            User user = new TestUserHelper(userRepository, passwordEncoder).createUser();
            LoginRequest request = new LoginRequest(user.getEmail(), "123123123"); // default password from TestUserHelper;
            String jsonRequest = objectMapper.writeValueAsString(request);
            int ttlCookie = 7 * 24 * 60 * 60;
            String refreshTokenName = "refreshToken";

            mockMvc.perform(post(loginUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(cookie().exists(refreshTokenName))
                    .andExpect(cookie().httpOnly(refreshTokenName, true))
                    .andExpect(cookie().path(refreshTokenName, "/"))
                    .andExpect(cookie().sameSite(refreshTokenName, "lax"))
                    .andExpect(cookie().maxAge(refreshTokenName, ttlCookie));
        }

        @Test
        @DisplayName("Should return status 400 when request body is invalid")
        void shouldReturnStatus400_WhenRequestBodyIsInvalid() throws Exception {
            LoginRequest request = new LoginRequest("malformatedEmail", "short");
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(loginUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").exists())
                    .andExpect(jsonPath("$.details", hasItem(containsString("email"))))
                    .andExpect(jsonPath("$.details", hasItem(containsString("password"))));
        }

        @Test
        @DisplayName("Should return status 401 when credentials are invalid")
        void shouldReturnStatus401_WhenCredentialsAreInvalid() throws Exception {
            LoginRequest request = new LoginRequest("non-exist@test.com", "123123123");
            String jsonRequest = objectMapper.writeValueAsString(request);

            mockMvc.perform(post(loginUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(jsonRequest))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").exists());
        }

    }
}
