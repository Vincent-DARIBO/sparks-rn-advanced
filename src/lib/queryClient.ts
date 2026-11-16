import { QueryClient } from '@tanstack/react-query';

import { BookNotFoundError } from '@/errors/OpenLibraryError';

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !(error instanceof BookNotFoundError) && failureCount < MAX_RETRIES,
    },
  },
});
