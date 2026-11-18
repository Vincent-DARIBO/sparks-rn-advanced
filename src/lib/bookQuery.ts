import { queryOptions } from '@tanstack/react-query';

import { OpenLibraryService } from '@/services/OpenLibraryService';

const BOOK_STALE_TIME = 1000 * 60 * 60 * 24;

export const bookKeys = {
  all: ['books'] as const,
  detail: (isbn: string) => [...bookKeys.all, 'detail', isbn] as const,
};

export function bookQueryOptions(isbn: string) {
  return queryOptions({
    queryKey: bookKeys.detail(isbn),
    queryFn: () => OpenLibraryService.getByIsbn(isbn),
    staleTime: BOOK_STALE_TIME,
  });
}
