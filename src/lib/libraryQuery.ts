import { queryOptions } from '@tanstack/react-query';

import { LibraryService } from '@/features/library/services/LibraryService';
import { libraryKeys } from '@/lib/libraryKeys';

export function libraryQueryOptions() {
  return queryOptions({
    queryKey: libraryKeys.all,
    queryFn: () => LibraryService.getAddedBooks(),
    networkMode: 'always',
    staleTime: Infinity,
  });
}
