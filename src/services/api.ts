import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

/**
 * Centralized Axios instance for all API calls.
 * - Sets the base URL from environment
 * - Attaches auth token via request interceptor
 * - Normalizes error responses via response interceptor
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    // Access Zustand persisted auth state from localStorage
    // This avoids circular imports with the auth store
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          const token = parsed?.state?.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {
        // Silently fail — token will not be attached
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || `Request failed with status ${status}`;

      // On 401, the token is expired or invalid — clear auth state
      if (status === 401 && typeof window !== 'undefined') {
        try {
          localStorage.removeItem('auth-storage');
        } catch {
          // Silently fail
        }
      }

      return Promise.reject({ message, status });
    }

    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    }

    return Promise.reject({
      message: error.message || 'An unexpected error occurred.',
    });
  }
);

export default api;
