import { useQuery } from '@tanstack/react-query';

import { LibraryService } from '@/features/library/services/LibraryService';
import { useLibraryStore } from '@/features/library/stores/libraryStore';
import { libraryQueryOptions } from '@/lib/libraryQuery';
import type { Book } from '@/types/book.types';

const NO_ADDED_BOOKS: Book[] = [];

export default function useLibrary() {
  const { data, isLoading, error } = useQuery(libraryQueryOptions());
  const sortKey = useLibraryStore((state) => state.sortKey);
  const setSortKey = useLibraryStore((state) => state.setSortKey);

  return {
    addedBooks: data ?? NO_ADDED_BOOKS,
    seedBooks: LibraryService.getSeedBooks(),
    isLoadingLibrary: isLoading,
    errorLibrary: error,
    sortKey,
    setSortKey,
  };
}
