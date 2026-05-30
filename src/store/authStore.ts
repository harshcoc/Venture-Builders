import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, ApiError } from '@/types';
import * as authApi from '@/services/authApi';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Auth store with persistence.
 * Persists user and token to localStorage so the session survives page reloads.
 * The `login` action calls the auth API, and `logout` clears all persisted state.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (username: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(username, password);
          const user: AuthUser = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
          };
          set({
            user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return true;
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Login failed. Please try again.',
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
        // Clear all persisted stores on logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH);
          localStorage.removeItem(STORAGE_KEYS.USERS);
          localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (accessToken) => set({ accessToken }),
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      // Only persist these fields — loading and error are ephemeral
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
