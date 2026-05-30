import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY_MS } from '@/utils/constants';

/**
 * Debounces a value by the specified delay.
 * Returns the debounced value that only updates after the delay has passed
 * without any new changes. Useful for search inputs to prevent excessive API calls.
 */
export function useDebounce<T>(value: T, delay: number = DEBOUNCE_DELAY_MS): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
