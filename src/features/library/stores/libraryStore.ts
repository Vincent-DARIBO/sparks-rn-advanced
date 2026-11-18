import { create } from 'zustand';

import type { SortKey } from '@/features/library/types/library.types';

type LibraryState = {
  sortKey: SortKey;
  setSortKey: (sortKey: SortKey) => void;
};

export const useLibraryStore = create<LibraryState>((set) => ({
  sortKey: 'title',
  setSortKey: (sortKey) => set({ sortKey }),
}));
