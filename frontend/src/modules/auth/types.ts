// Auth request/response types matching backend DTOs

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  data: UserResponse;
}

export interface RefreshResponse {
  message: string;
  token: string;
}

export interface UserResponse {
  email: string;
  displayName: string;
  createdAt: string;
}
