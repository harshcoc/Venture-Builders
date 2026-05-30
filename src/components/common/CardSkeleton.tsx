'use client';
import React, { memo } from 'react';
import { Card, Skeleton, Box, Grid } from '@mui/material';

interface CardSkeletonProps {
  count?: number;
}

const SingleCardSkeleton = memo(function SingleCardSkeleton() {
  return (
    <Card elevation={0} sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="30%" height={24} />
        </Box>
        <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
      </Box>
    </Card>
  );
});

const CardSkeleton = memo(function CardSkeleton({ count = 8 }: CardSkeletonProps) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <SingleCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
});

export default CardSkeleton;
