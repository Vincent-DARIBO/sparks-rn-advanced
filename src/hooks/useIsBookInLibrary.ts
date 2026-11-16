import { useQuery } from '@tanstack/react-query';

import { libraryQueryOptions } from '@/lib/libraryQuery';

export default function useIsBookInLibrary(isbn: string) {
  const { data } = useQuery({
    ...libraryQueryOptions(),
    select: (books) => books.some((added) => added.isbn === isbn),
  });

  return { isInLibrary: data ?? false };
}
