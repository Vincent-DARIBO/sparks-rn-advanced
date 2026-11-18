import type { MutationObserverOptions, QueryClient } from '@tanstack/react-query';

import { LibraryService } from '@/features/library/services/LibraryService';
import { addToLibraryMutationKey, libraryKeys } from '@/lib/libraryKeys';
import type { Book } from '@/types/book.types';

type AddToLibraryContext = {
  previousBooks?: Book[];
};

export async function syncLibraryAfterRestore(client: QueryClient) {
  await client.resumePausedMutations();
  if (client.isMutating({ mutationKey: addToLibraryMutationKey }) === 0) {
    await client.invalidateQueries({ queryKey: libraryKeys.all });
  }
}

export function registerLibraryMutationDefaults(client: QueryClient) {
  const addToLibraryOptions: MutationObserverOptions<Book, Error, Book, AddToLibraryContext> = {
    mutationFn: (book) => LibraryService.addBook(book),
    onMutate: async (book) => {
      await client.cancelQueries({ queryKey: libraryKeys.all });
      const previousBooks = client.getQueryData<Book[]>(libraryKeys.all);
      client.setQueryData<Book[]>(libraryKeys.all, (books = []) =>
        books.some((added) => added.isbn === book.isbn) ? books : [book, ...books],
      );
      return { previousBooks };
    },
    onError: (_error, _book, context) => {
      client.setQueryData(libraryKeys.all, context?.previousBooks);
    },
    onSettled: () => client.invalidateQueries({ queryKey: libraryKeys.all }),
  };

  client.setMutationDefaults(addToLibraryMutationKey, addToLibraryOptions);
}
