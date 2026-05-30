'use client';
import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

export default function GlobalError({
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
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Card elevation={4} sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorOutlinedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </Typography>
          <Button variant="contained" onClick={reset} size="large">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
