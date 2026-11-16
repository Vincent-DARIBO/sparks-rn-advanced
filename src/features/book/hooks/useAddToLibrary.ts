import { useMutation } from '@tanstack/react-query';

import { addToLibraryMutationKey } from '@/lib/libraryKeys';
import type { Book } from '@/types/book.types';

type UseAddToLibraryOptions = {
  onSuccess?: (book: Book) => void;
  onError?: (error: Error) => void;
};

export default function useAddToLibrary(options: UseAddToLibraryOptions = {}) {
  const { onSuccess, onError } = options;

  const { mutate, isPending, isSuccess, error } = useMutation<Book, Error, Book>({
    mutationKey: addToLibraryMutationKey,
  });

  const addToLibrary = (book: Book) => {
    mutate(book, {
      onSuccess: (addedBook) => onSuccess?.(addedBook),
      onError: (mutationError) => onError?.(mutationError),
    });
  };

  return {
    addToLibrary,
    isAddingToLibrary: isPending,
    isAddedToLibrary: isSuccess,
    errorAddToLibrary: error,
  };
}
