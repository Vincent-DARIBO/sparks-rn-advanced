import { useSyncExternalStore } from 'react';

import seed from '@/data/books.seed.json';
import type { Book } from '@/types/book.types';

let addedBooks: Book[] = [];
const listeners = new Set<() => void>();

export function addBook(book: Book) {
  if (addedBooks.some((b) => b.isbn === book.isbn)) return;
  console.log('addBook', book.isbn);
  addedBooks = [book, ...addedBooks];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return addedBooks;
}

export function useAddedBooks() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export const seedBooks: Book[] = seed;
