import { useState, useEffect } from "react";

/**
 * Custom hook to debounce rapidly changing values (like search inputs).
 * Delays updating the returned value until `delay` milliseconds have passed without a change.
 * Useful for reducing unnecessary API calls or URL updates while typing.
 * 
 * @param value - The changing value to debounce.
 * @param delay - Milliseconds to wait before returning the latest value (defaults to 500ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes before the timeout completes, clear the timeout
    // This prevents the update from happening until the user stops typing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}