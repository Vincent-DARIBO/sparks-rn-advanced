import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type QueryWrapperProps = {
  children: ReactNode;
};

export default function createQueryWrapper(queryClient: QueryClient) {
  return function QueryWrapper(props: QueryWrapperProps) {
    const { children } = props;
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
