import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// Create a query client that is scoped to the current request
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
);
