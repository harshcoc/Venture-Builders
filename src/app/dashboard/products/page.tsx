'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { useDebounce } from '@/hooks/useDebounce';
import SearchBar from '@/components/common/SearchBar';
import PageHeader from '@/components/common/PageHeader';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import PaginationComponent from '@/components/common/PaginationComponent';
import ProductGrid from '@/components/products/ProductGrid';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import CategoryFilter from '@/components/products/CategoryFilter';

function ProductsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    products,
    categories,
    loading,
    error,
    total,
    limit,
    selectedCategory,
    fetchProducts,
    searchProducts,
    fetchCategories,
    fetchProductsByCategory,
    setPage,
    setCategory,
    clearError,
  } = useProductStore();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);

  const currentPage = Number(searchParams.get('page')) || 1;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products based on search, category, and page
  useEffect(() => {
    const skip = (currentPage - 1) * limit;
    if (debouncedSearch) {
      searchProducts(debouncedSearch, limit, skip);
    } else if (selectedCategory) {
      fetchProductsByCategory(selectedCategory, limit, skip);
    } else {
      fetchProducts(limit, skip);
    }
  }, [
    currentPage,
    debouncedSearch,
    selectedCategory,
    limit,
    fetchProducts,
    searchProducts,
    fetchProductsByCategory,
  ]);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage, setPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(page));
      router.push(`/dashboard/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      setCategory('');
      router.push('/dashboard/products?page=1');
    },
    [setCategory, router]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setCategory(category);
      setSearchInput('');
      router.push('/dashboard/products?page=1');
      if (category) {
        fetchProductsByCategory(category, limit, 0);
      } else {
        fetchProducts(limit, 0, true);
      }
    },
    [setCategory, fetchProductsByCategory, fetchProducts, limit, router]
  );

  const handleRetry = useCallback(() => {
    clearError();
    fetchProducts(limit, (currentPage - 1) * limit, true);
  }, [clearError, fetchProducts, limit, currentPage]);

  return (
    <Box>
      <PageHeader title="Products" subtitle={`${total} products total`} />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </Box>

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {loading ? (
        <ProductCardSkeleton count={limit} />
      ) : products.length === 0 ? (
        <EmptyState
          message={
            debouncedSearch
              ? `No products found for "${debouncedSearch}"`
              : selectedCategory
                ? `No products in this category`
                : 'No products available.'
          }
        />
      ) : (
        <>
          <ProductGrid products={products} />
          <PaginationComponent
            total={total}
            limit={limit}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<ProductCardSkeleton count={10} />}>
      <ProductsPageClient />
    </React.Suspense>
  );
}
