import { useInfiniteQuery } from '@tanstack/react-query';

import { OpenLibraryService } from '@/services/OpenLibraryService';

const MIN_QUERY_LENGTH = 3;

const searchKeys = {
  all: ['search'] as const,
  list: (query: string) => [...searchKeys.all, query] as const,
};

export default function useSearchBooks(query: string) {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: searchKeys.list(query),
      queryFn: ({ pageParam }) => OpenLibraryService.search(query, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
      enabled: query.length >= MIN_QUERY_LENGTH,
    });

  return {
    searchResults: data?.pages.flatMap((page) => page.results) ?? [],
    isLoadingSearch: isLoading,
    errorSearch: error,
    hasMoreSearchResults: hasNextPage,
    isFetchingMoreSearchResults: isFetchingNextPage,
    fetchMoreSearchResults: fetchNextPage,
  };
}
