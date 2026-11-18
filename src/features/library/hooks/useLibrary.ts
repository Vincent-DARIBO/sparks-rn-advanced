import { useQuery } from '@tanstack/react-query';

import { LibraryService } from '@/features/library/services/LibraryService';
import { useLibraryStore } from '@/features/library/stores/libraryStore';
import { libraryQueryOptions } from '@/lib/libraryQuery';

export default function useLibrary() {
  const { data, isLoading, error } = useQuery(libraryQueryOptions());
  const sortKey = useLibraryStore((state) => state.sortKey);
  const setSortKey = useLibraryStore((state) => state.setSortKey);

  return {
    addedBooks: data ?? [],
    seedBooks: LibraryService.getSeedBooks(),
    isLoadingLibrary: isLoading,
    errorLibrary: error,
    sortKey,
    setSortKey,
  };
}
