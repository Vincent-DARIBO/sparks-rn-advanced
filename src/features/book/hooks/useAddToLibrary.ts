import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LibraryService } from '@/features/library/services/LibraryService';
import { addToLibraryMutationKey, libraryKeys } from '@/lib/libraryKeys';
import type { Book } from '@/types/book.types';

type UseAddToLibraryOptions = {
  onSuccess?: (book: Book) => void;
  onError?: (error: Error) => void;
};

type AddToLibraryContext = {
  previousBooks?: Book[];
};

export default function useAddToLibrary(options: UseAddToLibraryOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, error } = useMutation<
    Book,
    Error,
    Book,
    AddToLibraryContext
  >({
    mutationKey: addToLibraryMutationKey,
    mutationFn: (book) => LibraryService.addBook(book),
    onMutate: async (book) => {
      await queryClient.cancelQueries({ queryKey: libraryKeys.all });
      const previousBooks = queryClient.getQueryData<Book[]>(libraryKeys.all);
      queryClient.setQueryData<Book[]>(libraryKeys.all, (books = []) =>
        books.some((added) => added.isbn === book.isbn) ? books : [book, ...books],
      );
      return { previousBooks };
    },
    onError: (mutationError, _book, context) => {
      queryClient.setQueryData(libraryKeys.all, context?.previousBooks);
      onError?.(mutationError);
    },
    onSuccess: (book) => onSuccess?.(book),
    onSettled: () => queryClient.invalidateQueries({ queryKey: libraryKeys.all }),
  });

  return {
    addToLibrary: mutate,
    isAddingToLibrary: isPending,
    isAddedToLibrary: isSuccess,
    errorAddToLibrary: error,
  };
}
