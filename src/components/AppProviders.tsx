import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { ReactNode } from 'react';

import { syncLibraryAfterRestore } from '@/lib/libraryMutations';
import { QUERY_CACHE_MAX_AGE, queryClient } from '@/lib/queryClient';
import { setupQueryLifecycle } from '@/lib/queryLifecycle';
import { queryPersister } from '@/lib/queryPersister';

setupQueryLifecycle();

const persistOptions = { persister: queryPersister, maxAge: QUERY_CACHE_MAX_AGE };

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders(props: AppProvidersProps) {
  const { children } = props;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={() => syncLibraryAfterRestore(queryClient)}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
