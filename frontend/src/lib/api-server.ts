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

// We simulate a fetch here. In a real scenario, we'd use 'axios' if not using server actions,
// but fetch is often preferred for server components due to Next.js caching APIs.
// This is a helper for hydration.
export async function getMockServerData() {
  // Simulating an API call latency to get initial config or status
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    status: 'online',
    message: 'Mock server is ready',
    features: {
      socialLogin: false,
      signupEnabled: true,
    }
  };
}
