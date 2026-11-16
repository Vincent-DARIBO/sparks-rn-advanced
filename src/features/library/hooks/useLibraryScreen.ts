import { useCallback, useMemo } from 'react';

import useLibrary from '@/features/library/hooks/useLibrary';
import type { Book } from '@/types/book.types';

export default function useLibraryScreen() {
  const { addedBooks, seedBooks, sortKey, setSortKey } = useLibrary();

  const sortedSeedBooks = useMemo(
    () => [...seedBooks].sort((a, b) => a[sortKey].localeCompare(b[sortKey])),
    [seedBooks, sortKey],
  );
  const books = useMemo(() => [...addedBooks, ...sortedSeedBooks], [addedBooks, sortedSeedBooks]);

  const keyExtractor = useCallback((book: Book) => book.isbn, []);
  const sortByTitle = useCallback(() => setSortKey('title'), [setSortKey]);
  const sortByAuthor = useCallback(() => setSortKey('author'), [setSortKey]);

  return { books, keyExtractor, sortByTitle, sortByAuthor };
}
