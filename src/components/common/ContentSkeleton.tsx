'use client';
import React, { memo } from 'react';
import { Box, Skeleton, Card, Grid } from '@mui/material';

const ContentSkeleton = memo(function ContentSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card elevation={0} sx={{ p: 2 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card elevation={0} sx={{ p: 3 }}>
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
});

export default ContentSkeleton;
