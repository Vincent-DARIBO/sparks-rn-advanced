import { Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import type { ComponentType } from 'react';

import createQueryWrapper from '@/test-utils/createQueryWrapper';
import createTestQueryClient from '@/test-utils/createTestQueryClient';

type Routes = Record<string, ComponentType>;

export default async function renderRouterWithProviders(routes: Routes, initialUrl: string) {
  const queryClient = createTestQueryClient();
  const QueryWrapper = createQueryWrapper(queryClient);

  function ProvidersLayout() {
    return (
      <QueryWrapper>
        <Slot />
      </QueryWrapper>
    );
  }

  const result = await renderRouter({ _layout: ProvidersLayout, ...routes }, { initialUrl });
  return { ...result, queryClient };
}
