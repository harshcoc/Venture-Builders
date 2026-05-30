'use client';
import React, { memo } from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

interface BackButtonProps {
  href: string;
  label?: string;
}

const BackButton = memo(function BackButton({
  href,
  label = 'Back',
}: BackButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      sx={{ mb: 2 }}
    >
      {label}
    </Button>
  );
});

export default BackButton;
