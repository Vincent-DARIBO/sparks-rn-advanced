import { useCallback, useMemo } from 'react';

import useLibrary from '@/features/library/hooks/useLibrary';
import type { LibraryRow, SortKey } from '@/features/library/types/library.types';
import type { Book } from '@/types/book.types';

const ADDED_BOOKS_LABEL = 'Mes ajouts';
const NON_LETTER_LABEL = '#';

function initialLetter(text: string): string {
  const firstCharacter = text.normalize('NFD').charAt(0).toUpperCase();
  return /[A-Z]/.test(firstCharacter) ? firstCharacter : NON_LETTER_LABEL;
}

function buildRows(addedBooks: Book[], seedBooks: Book[], sortKey: SortKey): LibraryRow[] {
  const rows: LibraryRow[] = [];

  if (addedBooks.length > 0) {
    rows.push({ type: 'header', id: 'header-added', label: ADDED_BOOKS_LABEL });
    addedBooks.forEach((book) => rows.push({ type: 'book', id: `added-${book.isbn}`, book }));
  }

  const sortedSeedBooks = [...seedBooks].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  let currentLetter = '';
  sortedSeedBooks.forEach((book) => {
    const letter = initialLetter(book[sortKey]);
    if (letter !== currentLetter) {
      currentLetter = letter;
      rows.push({ type: 'header', id: `header-${letter}`, label: letter });
    }
    rows.push({ type: 'book', id: `book-${book.isbn}`, book });
  });

  return rows;
}

export default function useLibraryScreen() {
  const { addedBooks, seedBooks, sortKey, setSortKey } = useLibrary();

  const rows = useMemo(
    () => buildRows(addedBooks, seedBooks, sortKey),
    [addedBooks, seedBooks, sortKey],
  );

  const keyExtractor = useCallback((row: LibraryRow) => row.id, []);
  const getItemType = useCallback((row: LibraryRow) => row.type, []);
  const sortByTitle = useCallback(() => setSortKey('title'), [setSortKey]);
  const sortByAuthor = useCallback(() => setSortKey('author'), [setSortKey]);

  return { rows, keyExtractor, getItemType, sortByTitle, sortByAuthor };
}
