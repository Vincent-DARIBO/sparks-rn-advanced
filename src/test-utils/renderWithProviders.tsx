import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import createQueryWrapper from '@/test-utils/createQueryWrapper';
import createTestQueryClient from '@/test-utils/createTestQueryClient';

export default async function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();
  const result = await render(ui, { wrapper: createQueryWrapper(queryClient) });
  return { ...result, queryClient };
}
