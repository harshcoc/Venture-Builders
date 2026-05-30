import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ApiError } from '@/types';
import * as userApi from '@/services/userApi';
import { STORAGE_KEYS, DEFAULT_PAGE_LIMIT, CACHE_TTL_MS } from '@/utils/constants';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  skip: number;
  search: string;
  /** Timestamp of last list fetch — used for cache expiry (10 min TTL) */
  lastFetchTime: number | null;
}

interface UserActions {
  fetchUsers: (limit?: number, skip?: number, force?: boolean) => Promise<void>;
  searchUsers: (query: string, limit?: number, skip?: number) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  clearSelectedUser: () => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

/**
 * User store with caching.
 * Cache strategy: persisted to localStorage with a 10-minute TTL.
 * When fetchUsers is called, it checks if cached data is still fresh.
 * If the cache is stale (>10 minutes), it refetches from the API.
 * This prevents redundant network requests during normal navigation.
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // State
      users: [],
      selectedUser: null,
      loading: false,
      error: null,
      total: 0,
      limit: DEFAULT_PAGE_LIMIT,
      skip: 0,
      search: '',
      lastFetchTime: null,

      // Actions
      fetchUsers: async (
        limit = get().limit,
        skip = get().skip,
        force = false
      ) => {
        const state = get();
        // Cache check: if data exists and is fresh, skip the request
        const isCacheValid =
          !force &&
          state.users.length > 0 &&
          state.lastFetchTime &&
          Date.now() - state.lastFetchTime < CACHE_TTL_MS &&
          state.skip === skip &&
          state.limit === limit &&
          !state.search;

        if (isCacheValid) return;

        set({ loading: true, error: null });
        try {
          const data = await userApi.getUsers(limit, skip);
          set({
            users: data.users,
            total: data.total,
            limit: data.limit,
            skip: data.skip,
            loading: false,
            lastFetchTime: Date.now(),
          });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to fetch users.',
          });
        }
      },

      searchUsers: async (
        query: string,
        limit = get().limit,
        skip = 0
      ) => {
        set({ loading: true, error: null, search: query, skip });
        try {
          const data = await userApi.searchUsers(query, limit, skip);
          set({
            users: data.users,
            total: data.total,
            limit: data.limit,
            skip: data.skip,
            loading: false,
            // Don't update lastFetchTime for search results — they shouldn't be cached
            lastFetchTime: null,
          });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to search users.',
          });
        }
      },

      fetchUserById: async (id: number) => {
        set({ loading: true, error: null, selectedUser: null });
        try {
          const user = await userApi.getUserById(id);
          set({ selectedUser: user, loading: false });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to fetch user details.',
          });
        }
      },

      setSearch: (search) => set({ search }),
      setPage: (page) => set({ skip: (page - 1) * get().limit }),
      clearSelectedUser: () => set({ selectedUser: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.USERS,
      partialize: (state) => ({
        users: state.users,
        total: state.total,
        limit: state.limit,
        skip: state.skip,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
