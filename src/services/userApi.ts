import api from './api';
import { User, UserPaginatedResponse } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Fetch paginated list of users.
 */
export async function getUsers(
  limit: number,
  skip: number
): Promise<UserPaginatedResponse> {
  const response = await api.get<UserPaginatedResponse>(API_ENDPOINTS.USERS, {
    params: { limit, skip },
  });
  return response.data;
}

/**
 * Search users by query string.
 */
export async function searchUsers(
  query: string,
  limit: number,
  skip: number
): Promise<UserPaginatedResponse> {
  const response = await api.get<UserPaginatedResponse>(
    API_ENDPOINTS.USERS_SEARCH,
    { params: { q: query, limit, skip } }
  );
  return response.data;
}

/**
 * Fetch a single user by ID.
 */
export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  return response.data;
}
