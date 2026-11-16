import { create } from 'zustand';

import type { SortKey } from '@/features/library/types/library.types';

type LibraryState = {
  sortKey: SortKey;
  favoriteIsbns: ReadonlySet<string>;
  setSortKey: (sortKey: SortKey) => void;
  toggleFavorite: (isbn: string) => void;
};

export const useLibraryStore = create<LibraryState>((set) => ({
  sortKey: 'title',
  favoriteIsbns: new Set<string>(),
  setSortKey: (sortKey) => set({ sortKey }),
  toggleFavorite: (isbn) =>
    set((state) => {
      const favoriteIsbns = new Set(state.favoriteIsbns);
      if (favoriteIsbns.has(isbn)) {
        favoriteIsbns.delete(isbn);
      } else {
        favoriteIsbns.add(isbn);
      }
      return { favoriteIsbns };
    }),
}));
