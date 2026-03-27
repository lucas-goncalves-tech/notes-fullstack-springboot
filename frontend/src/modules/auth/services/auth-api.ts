import { api } from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshResponse, UserResponse } from '@/modules/auth/types';

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  // Goes through Next.js proxy to handle cross-domain cookies
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result, status: response.status } };
  }

  return result;
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
}

export async function refreshToken(): Promise<RefreshResponse> {
  // Goes through Next.js proxy to handle cross-domain cookies
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw { response: { data: result, status: response.status } };
  }

  return result;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function fetchCurrentUser(): Promise<UserResponse> {
  const response = await api.get<UserResponse>('/users/me');
  return response.data;
}
