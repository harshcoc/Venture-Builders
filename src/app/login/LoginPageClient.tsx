'use client';
import React from 'react';
import { Box } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPageClient() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0e17 0%, #1a1a2e 50%, #16213e 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 50%, #dbeafe 100%)',
        p: 2,
      }}
    >
      <LoginForm />
    </Box>
  );
}
