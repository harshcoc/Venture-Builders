'use client';
import React, { memo } from 'react';
import { Alert, Button } from '@mui/material';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = memo(function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
});

export default ErrorMessage;
