import { useQuery } from '@tanstack/react-query';

import { bookQueryOptions } from '@/lib/bookQuery';

export default function useBook(isbn: string) {
  const { data, isLoading, error, refetch } = useQuery(bookQueryOptions(isbn));

  return {
    book: data,
    isLoadingBook: isLoading,
    errorBook: error,
    refetchBook: refetch,
  };
}
