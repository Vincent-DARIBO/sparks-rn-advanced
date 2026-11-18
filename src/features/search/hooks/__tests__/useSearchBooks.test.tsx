import { act, renderHook, waitFor } from '@testing-library/react-native';

import useSearchBooks from '@/features/search/hooks/useSearchBooks';
import { SERVER_ERROR_QUERY } from '@/mocks/handlers';
import createQueryWrapper from '@/test-utils/createQueryWrapper';
import createTestQueryClient from '@/test-utils/createTestQueryClient';

function renderSearchHook(query: string) {
  return renderHook(() => useSearchBooks(query), {
    wrapper: createQueryWrapper(createTestQueryClient()),
  });
}

describe('useSearchBooks', () => {
  it('charge la première page de résultats', async () => {
    const { result } = await renderSearchHook('dune');

    await waitFor(() => expect(result.current.searchResults).toHaveLength(20));
    expect(result.current.hasMoreSearchResults).toBe(true);
    expect(result.current.isLoadingSearch).toBe(false);
  });

  it('charge la page 2 et la concatène à la page 1', async () => {
    const { result } = await renderSearchHook('dune');
    await waitFor(() => expect(result.current.searchResults).toHaveLength(20));

    await act(async () => {
      await result.current.fetchMoreSearchResults();
    });

    await waitFor(() => expect(result.current.searchResults).toHaveLength(30));
    expect(result.current.searchResults[0].title).toBe('Dune 1');
    expect(result.current.searchResults[20].title).toBe('Dune 21');
    expect(result.current.hasMoreSearchResults).toBe(false);
  });

  it('ne lance aucune requête sous trois caractères', async () => {
    const { result } = await renderSearchHook('du');

    expect(result.current.isLoadingSearch).toBe(false);
    expect(result.current.searchResults).toEqual([]);
  });

  it('expose l’erreur quand le serveur répond 500', async () => {
    const { result } = await renderSearchHook(SERVER_ERROR_QUERY);

    await waitFor(() => expect(result.current.errorSearch).not.toBeNull());
    expect(result.current.searchResults).toEqual([]);
  });
});
