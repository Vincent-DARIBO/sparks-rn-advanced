import { BookNotFoundError } from '@/errors/OpenLibraryError';
import useAddToLibrary from '@/features/book/hooks/useAddToLibrary';
import type { BookDetailStatus } from '@/features/book/types/bookDetail.types';
import useBook from '@/hooks/useBook';

function resolveStatus(isLoading: boolean, error: Error | null, hasBook: boolean): BookDetailStatus {
  if (isLoading) return 'loading';
  if (error instanceof BookNotFoundError) return 'notFound';
  if (error || !hasBook) return 'error';
  return 'success';
}

export default function useBookDetail(isbn: string) {
  const { book, isLoadingBook, errorBook, refetchBook } = useBook(isbn);
  const { addToLibrary, isAddedToLibrary } = useAddToLibrary();

  const addCurrentBook = () => {
    if (book) addToLibrary(book);
  };

  const retry = () => {
    refetchBook();
  };

  return {
    book,
    status: resolveStatus(isLoadingBook, errorBook, book !== undefined),
    isAdded: isAddedToLibrary,
    addToLibrary: addCurrentBook,
    retry,
  };
}
