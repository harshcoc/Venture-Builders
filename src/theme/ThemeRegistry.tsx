'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeStore } from '@/store/uiStore';
import { getTheme } from './theme';

/**
 * ThemeRegistry handles MUI ThemeProvider with dark/light mode toggle.
 * Uses a mounted state to prevent hydration mismatch between server and client,
 * since the theme mode is read from localStorage (client-only).
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const theme = useMemo(() => getTheme(mounted ? mode : 'dark'), [mode, mounted]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
