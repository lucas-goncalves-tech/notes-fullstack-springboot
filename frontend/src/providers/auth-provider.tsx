'use client';

import * as React from 'react';
import { setAccessToken } from '@/lib/axios';
import { refreshToken, fetchCurrentUser, logoutUser } from '@/modules/auth/services/auth-api';
import type { UserResponse } from '@/modules/auth/types';

interface AuthContextValue {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserResponse | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // On mount, try to restore session via refresh token cookie
  React.useEffect(() => {
    async function restoreSession() {
      try {
        const refreshResult = await refreshToken();
        const newToken = refreshResult.token;

        setAccessToken(newToken);
        setToken(newToken);

        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch {
        // No valid refresh token — user is not authenticated
        setAccessToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = React.useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    setToken(accessToken);

    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
