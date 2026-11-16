import seed from '@/data/books.seed.json';
import { StorageError } from '@/errors/StorageError';
import type { Book } from '@/types/book.types';

const seedBooks: Book[] = seed;

let addedBooks: Book[] = [];

export class LibraryService {
  static async getAddedBooks(): Promise<Book[]> {
    try {
      return [...addedBooks];
    } catch (error) {
      throw StorageError.readFailed(error);
    }
  }

  static async addBook(book: Book): Promise<Book> {
    try {
      if (!addedBooks.some((added) => added.isbn === book.isbn)) {
        addedBooks = [book, ...addedBooks];
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
