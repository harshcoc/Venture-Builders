'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box } from '@mui/material';
import { useProductStore } from '@/store/productStore';
import BackButton from '@/components/common/BackButton';
import ErrorMessage from '@/components/common/ErrorMessage';
import ContentSkeleton from '@/components/common/ContentSkeleton';
import ProductDetailView from '@/components/products/ProductDetailView';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    clearSelectedProduct,
    clearError,
  } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  return (
    <Box>
      <BackButton href="/dashboard/products" label="Back to Products" />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            fetchProductById(id);
          }}
        />
      )}

      {loading ? (
        <ContentSkeleton />
      ) : selectedProduct ? (
        <ProductDetailView product={selectedProduct} />
      ) : (
        !error && <ContentSkeleton />
      )}
    </Box>
  );
}
