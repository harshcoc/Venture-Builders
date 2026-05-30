import api from './api';
import { Product, ProductPaginatedResponse, Category } from '@/types';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Fetch paginated list of products.
 */
export async function getProducts(
  limit: number,
  skip: number
): Promise<ProductPaginatedResponse> {
  const response = await api.get<ProductPaginatedResponse>(
    API_ENDPOINTS.PRODUCTS,
    { params: { limit, skip } }
  );
  return response.data;
}

/**
 * Search products by query string.
 */
export async function searchProducts(
  query: string,
  limit: number,
  skip: number
): Promise<ProductPaginatedResponse> {
  const response = await api.get<ProductPaginatedResponse>(
    API_ENDPOINTS.PRODUCTS_SEARCH,
    { params: { q: query, limit, skip } }
  );
  return response.data;
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
}

/**
 * Fetch all product categories.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>(API_ENDPOINTS.PRODUCTS_CATEGORIES);
  return response.data;
}

/**
 * Fetch products filtered by category slug.
 */
export async function getProductsByCategory(
  categorySlug: string,
  limit: number,
  skip: number
): Promise<ProductPaginatedResponse> {
  const response = await api.get<ProductPaginatedResponse>(
    `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}/${categorySlug}`,
    { params: { limit, skip } }
  );
  return response.data;
}
