import { QueryClient } from '@tanstack/react-query';

import { BookNotFoundError } from '@/errors/OpenLibraryError';
import { registerLibraryMutationDefaults } from '@/lib/libraryMutations';

const MAX_RETRIES = 2;

export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_CACHE_MAX_AGE,
      retry: (failureCount, error) =>
        !(error instanceof BookNotFoundError) && failureCount < MAX_RETRIES,
    },
  },
});

registerLibraryMutationDefaults(queryClient);
