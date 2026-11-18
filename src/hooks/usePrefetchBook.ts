import { useQueryClient } from '@tanstack/react-query';

import { bookQueryOptions } from '@/lib/bookQuery';

export default function usePrefetchBook() {
  const queryClient = useQueryClient();

  const prefetchBook = (isbn: string) => queryClient.prefetchQuery(bookQueryOptions(isbn));

  return { prefetchBook };
}
