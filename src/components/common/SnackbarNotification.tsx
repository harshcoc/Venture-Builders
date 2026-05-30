'use client';
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/store/uiStore';

/**
 * Global snackbar notification component.
 * Renders at the bottom-left of the screen and auto-hides after 4 seconds.
 * Reads state from the snackbar Zustand store.
 */
export default function SnackbarNotification() {
  const { open, message, severity, hideSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
