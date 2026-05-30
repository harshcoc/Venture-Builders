'use client';
import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

const EmptyState = memo(function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        gap: 2,
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.disabled' }} />}
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center' }}>
        {message}
      </Typography>
    </Box>
  );
});

export default EmptyState;
