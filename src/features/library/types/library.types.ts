import type { Book } from '@/types/book.types';

export type SortKey = 'title' | 'author';

export type LibraryHeaderRow = {
  type: 'header';
  id: string;
  label: string;
};

export type LibraryBookRow = {
  type: 'book';
  id: string;
  book: Book;
};

export type LibraryRow = LibraryHeaderRow | LibraryBookRow;
