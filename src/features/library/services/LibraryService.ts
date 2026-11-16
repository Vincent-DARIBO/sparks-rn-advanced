import { createMMKV } from 'react-native-mmkv';

import seed from '@/data/books.seed.json';
import { StorageError } from '@/errors/StorageError';
import type { Book } from '@/types/book.types';

const ADDED_BOOKS_KEY = 'added-books';

const seedBooks: Book[] = seed;
const libraryStorage = createMMKV({ id: 'library' });

function readAddedBooks(): Book[] {
  const raw = libraryStorage.getString(ADDED_BOOKS_KEY);
  return raw ? (JSON.parse(raw) as Book[]) : [];
}

export class LibraryService {
  static async getAddedBooks(): Promise<Book[]> {
    try {
      return readAddedBooks();
    } catch (error) {
      throw StorageError.readFailed(error);
    }
  }

  static async addBook(book: Book): Promise<Book> {
    try {
      const addedBooks = readAddedBooks();
      if (!addedBooks.some((added) => added.isbn === book.isbn)) {
        libraryStorage.set(ADDED_BOOKS_KEY, JSON.stringify([book, ...addedBooks]));
      }
      return book;
    } catch (error) {
      throw StorageError.writeFailed(error);
    }
  }

  static getSeedBooks(): Book[] {
    return seedBooks;
  }
}
