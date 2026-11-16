import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { queryClient } from '@/lib/queryClient';
import { setupQueryLifecycle } from '@/lib/queryLifecycle';

setupQueryLifecycle();

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders(props: AppProvidersProps) {
  const { children } = props;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
