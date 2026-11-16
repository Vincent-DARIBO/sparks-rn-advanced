import { useCallback } from 'react';

import { useLibraryStore } from '@/features/library/stores/libraryStore';

export default function useFavorite(isbn: string) {
  const isFavorite = useLibraryStore((state) => state.favoriteIsbns.has(isbn));
  const toggleFavoriteInStore = useLibraryStore((state) => state.toggleFavorite);

  const toggleFavorite = useCallback(
    () => toggleFavoriteInStore(isbn),
    [toggleFavoriteInStore, isbn],
  );

  return { isFavorite, toggleFavorite };
}
