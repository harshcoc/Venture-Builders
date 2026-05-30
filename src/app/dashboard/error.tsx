'use client';
import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        p: 2,
      }}
    >
      <Card elevation={0} sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorOutlinedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
            Dashboard Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error.message || 'Something went wrong loading this page.'}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="contained" onClick={reset}>
              Try Again
            </Button>
            <Button variant="outlined" component={Link} href="/dashboard">
              Return to Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
