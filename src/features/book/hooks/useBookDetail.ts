import { useState } from 'react';

import { BookNotFoundError } from '@/errors/OpenLibraryError';
import useBook from '@/hooks/useBook';
import { addBook } from '@/store/library';

type BookDetailStatus = 'loading' | 'notFound' | 'error' | 'success';

function resolveStatus(isLoading: boolean, error: Error | null, hasBook: boolean): BookDetailStatus {
  if (isLoading) return 'loading';
  if (error instanceof BookNotFoundError) return 'notFound';
  if (error || !hasBook) return 'error';
  return 'success';
}

export default function useBookDetail(isbn: string) {
  const { book, isLoadingBook, errorBook, refetchBook } = useBook(isbn);
  const [isAdded, setIsAdded] = useState(false);

  const addToLibrary = () => {
    if (!book) return;
    addBook({ isbn, title: book.title, author: book.author });
    setIsAdded(true);
  };

  const retry = () => {
    refetchBook();
  };

  return {
    book,
    status: resolveStatus(isLoadingBook, errorBook, book !== undefined),
    isAdded,
    addToLibrary,
    retry,
  };
}
