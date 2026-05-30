'use client';
import React, { memo } from 'react';
import { Card, Skeleton, Box, Grid } from '@mui/material';

interface ProductCardSkeletonProps {
  count?: number;
}

const SingleSkeleton = memo(function SingleSkeleton() {
  return (
    <Card elevation={0} sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="35%" height={24} sx={{ mt: 0.5 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Skeleton variant="text" width="25%" height={28} />
          <Skeleton variant="text" width="20%" height={28} />
        </Box>
        <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />
        <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
      </Box>
    </Card>
  );
});

const ProductCardSkeleton = memo(function ProductCardSkeleton({
  count = 8,
}: ProductCardSkeletonProps) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <SingleSkeleton />
        </Grid>
      ))}
    </Grid>
  );
});

export default ProductCardSkeleton;
