import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SnackbarSeverity } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  hideSnackbar: () => void;
}

/**
 * Global snackbar notification store.
 * Any component or store can trigger a notification via showSnackbar.
 */
export const useSnackbarStore = create<SnackbarState>()((set) => ({
  open: false,
  message: '',
  severity: 'info',

  showSnackbar: (message, severity = 'info') =>
    set({ open: true, message, severity }),

  hideSnackbar: () => set({ open: false }),
}));

// Theme mode store
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
}

/**
 * Theme store with persistence.
 * Stores the user's preferred theme mode in localStorage.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggleTheme: () =>
        set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
    }),
    { name: STORAGE_KEYS.THEME }
  )
);
