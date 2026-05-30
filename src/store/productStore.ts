import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category, ApiError } from '@/types';
import * as productApi from '@/services/productApi';
import { STORAGE_KEYS, DEFAULT_PAGE_LIMIT, CACHE_TTL_MS } from '@/utils/constants';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  skip: number;
  search: string;
  selectedCategory: string;
  /** Timestamp of last product list fetch — used for 10-minute cache expiry */
  lastFetchTime: number | null;
  /** Timestamp of last category fetch — categories change rarely */
  lastCategoryFetchTime: number | null;
}

interface ProductActions {
  fetchProducts: (limit?: number, skip?: number, force?: boolean) => Promise<void>;
  searchProducts: (query: string, limit?: number, skip?: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: (force?: boolean) => Promise<void>;
  fetchProductsByCategory: (
    category: string,
    limit?: number,
    skip?: number
  ) => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setCategory: (category: string) => void;
  clearSelectedProduct: () => void;
  clearError: () => void;
}

type ProductStore = ProductState & ProductActions;

/**
 * Product store with caching and category filtering.
 * Cache invalidation: product list is cached for 10 minutes.
 * Categories are also cached for 10 minutes since they rarely change.
 * Search results are NOT cached — each search triggers a fresh API call.
 * Category filtering uses a separate endpoint and resets pagination.
 */
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // State
      products: [],
      selectedProduct: null,
      categories: [],
      loading: false,
      error: null,
      total: 0,
      limit: DEFAULT_PAGE_LIMIT,
      skip: 0,
      search: '',
      selectedCategory: '',
      lastFetchTime: null,
      lastCategoryFetchTime: null,

      // Actions
      fetchProducts: async (
        limit = get().limit,
        skip = get().skip,
        force = false
      ) => {
        const state = get();
        const isCacheValid =
          !force &&
          state.products.length > 0 &&
          state.lastFetchTime &&
          Date.now() - state.lastFetchTime < CACHE_TTL_MS &&
          state.skip === skip &&
          state.limit === limit &&
          !state.search &&
          !state.selectedCategory;

        if (isCacheValid) return;

        set({ loading: true, error: null });
        try {
          const data = await productApi.getProducts(limit, skip);
          set({
            products: data.products,
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
            error: apiErr.message || 'Failed to fetch products.',
          });
        }
      },

      searchProducts: async (
        query: string,
        limit = get().limit,
        skip = 0
      ) => {
        set({
          loading: true,
          error: null,
          search: query,
          skip,
          selectedCategory: '',
        });
        try {
          const data = await productApi.searchProducts(query, limit, skip);
          set({
            products: data.products,
            total: data.total,
            limit: data.limit,
            skip: data.skip,
            loading: false,
            lastFetchTime: null,
          });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to search products.',
          });
        }
      },

      fetchProductById: async (id: number) => {
        set({ loading: true, error: null, selectedProduct: null });
        try {
          const product = await productApi.getProductById(id);
          set({ selectedProduct: product, loading: false });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to fetch product details.',
          });
        }
      },

      fetchCategories: async (force = false) => {
        const state = get();
        const isCacheValid =
          !force &&
          state.categories.length > 0 &&
          state.lastCategoryFetchTime &&
          Date.now() - state.lastCategoryFetchTime < CACHE_TTL_MS;

        if (isCacheValid) return;

        try {
          const categories = await productApi.getCategories();
          set({ categories, lastCategoryFetchTime: Date.now() });
        } catch {
          // Categories failing shouldn't block the page
        }
      },

      fetchProductsByCategory: async (
        category: string,
        limit = get().limit,
        skip = 0
      ) => {
        set({
          loading: true,
          error: null,
          selectedCategory: category,
          search: '',
          skip,
        });
        try {
          const data = await productApi.getProductsByCategory(
            category,
            limit,
            skip
          );
          set({
            products: data.products,
            total: data.total,
            limit: data.limit,
            skip: data.skip,
            loading: false,
            lastFetchTime: null,
          });
        } catch (err: unknown) {
          const apiErr = err as ApiError;
          set({
            loading: false,
            error: apiErr.message || 'Failed to fetch category products.',
          });
        }
      },

      setSearch: (search) => set({ search }),
      setPage: (page) => set({ skip: (page - 1) * get().limit }),
      setCategory: (selectedCategory) => set({ selectedCategory }),
      clearSelectedProduct: () => set({ selectedProduct: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        total: state.total,
        limit: state.limit,
        skip: state.skip,
        lastFetchTime: state.lastFetchTime,
        lastCategoryFetchTime: state.lastCategoryFetchTime,
      }),
    }
  )
);
