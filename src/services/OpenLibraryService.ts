import { AppError } from '@/errors/AppError';
import { BookNotFoundError, OpenLibraryError } from '@/errors/OpenLibraryError';
import type { Book, SearchPage, SearchResult } from '@/types/book.types';

const BASE_URL = 'https://openlibrary.org';
const SEARCH_PAGE_SIZE = 20;

type BookDto = {
  title?: string;
  number_of_pages?: number;
  by_statement?: string;
};

type SearchDocDto = {
  key: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
};

type SearchResponseDto = {
  docs: SearchDocDto[];
  numFound: number;
  start: number;
};

function toBook(dto: BookDto, isbn: string): Book {
  return {
    isbn,
    title: dto.title ?? 'Sans titre',
    author: dto.by_statement ?? 'Auteur inconnu',
    numberOfPages: dto.number_of_pages,
  };
}

function toSearchResult(dto: SearchDocDto): SearchResult {
  return {
    key: dto.key,
    title: dto.title ?? 'Sans titre',
    author: dto.author_name?.[0] ?? 'Auteur inconnu',
    isbn: dto.isbn?.find((isbn) => isbn.startsWith('978')) ?? dto.isbn?.[0],
  };
}

function toSearchPage(dto: SearchResponseDto, page: number): SearchPage {
  return {
    results: dto.docs.map(toSearchResult),
    page,
    hasMore: dto.start + dto.docs.length < dto.numFound,
  };
}

function normalizeError(error: unknown): AppError {
  return error instanceof AppError ? error : OpenLibraryError.requestFailed(error);
}

export class OpenLibraryService {
  static async getByIsbn(isbn: string): Promise<Book> {
    try {
      const response = await fetch(`${BASE_URL}/isbn/${isbn}.json`);
      if (response.status === 404) throw new BookNotFoundError(isbn);
      if (!response.ok) throw OpenLibraryError.requestFailed({ status: response.status });
      const dto: BookDto = await response.json();
      return toBook(dto, isbn);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  static async search(query: string, page: number): Promise<SearchPage> {
    try {
      const response = await fetch(
        `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${SEARCH_PAGE_SIZE}&fields=key,title,author_name,isbn`,
      );
      if (!response.ok) throw OpenLibraryError.requestFailed({ status: response.status });
      const dto: SearchResponseDto = await response.json();
      return toSearchPage(dto, page);
    } catch (error) {
      throw normalizeError(error);
    }
  }
}
