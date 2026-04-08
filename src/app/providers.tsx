import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

/**
 * Props for the Providers wrapper component.
 */
interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root context provider for the application.
 * Wraps the app with necessary React context providers such as React Query.
 * 
 * @param props - Component props containing children elements.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  );
}