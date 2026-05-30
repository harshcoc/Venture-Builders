// API base URL from environment variable with fallback
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dummyjson.com';

// Pagination defaults
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_SKIP = 0;

// Cache TTL in milliseconds (10 minutes)
export const CACHE_TTL_MS = 10 * 60 * 1000;

// Debounce delay for search inputs (milliseconds)
export const DEBOUNCE_DELAY_MS = 500;

// Zustand persist storage keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  USERS: 'user-storage',
  PRODUCTS: 'product-storage',
  THEME: 'theme-storage',
} as const;

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  PRODUCTS: '/dashboard/products',
} as const;

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  USERS: '/users',
  USERS_SEARCH: '/users/search',
  PRODUCTS: '/products',
  PRODUCTS_SEARCH: '/products/search',
  PRODUCTS_CATEGORIES: '/products/categories',
  PRODUCTS_BY_CATEGORY: '/products/category',
} as const;
