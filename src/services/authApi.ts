import api from './api';
import { AuthResponse } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Authenticate user against DummyJSON.
 * Returns user data and access/refresh tokens.
 */
export async function login(
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, {
    username,
    password,
    expiresInMins: 60,
  });
  return response.data;
}
