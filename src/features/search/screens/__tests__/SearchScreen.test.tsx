import { screen, userEvent } from '@testing-library/react-native';

import BookDetailScreen from '@/features/book/screens/BookDetailScreen';
import SearchScreen from '@/features/search/screens/SearchScreen';
import { SERVER_ERROR_QUERY } from '@/mocks/handlers';
import renderRouterWithProviders from '@/test-utils/renderRouterWithProviders';

async function renderSearch() {
  return renderRouterWithProviders(
    { search: SearchScreen, 'book/[isbn]': BookDetailScreen },
    '/search',
  );
}

async function searchFor(query: string) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Titre du livre'), query);
  await user.press(screen.getByRole('button', { name: 'Chercher' }));
  return user;
}

describe('SearchScreen', () => {
  it('affiche les résultats de la recherche', async () => {
    await renderSearch();

    await searchFor('dune');

    expect(await screen.findByText('Dune 1')).toBeOnTheScreen();
    expect(screen.getAllByText('Frank Herbert').length).toBeGreaterThan(0);
  });

  it('affiche un message d’erreur quand la recherche échoue', async () => {
    await renderSearch();

    await searchFor(SERVER_ERROR_QUERY);

    expect(await screen.findByText('Erreur lors de la recherche')).toBeOnTheScreen();
  });

  it('ouvre le Détail du livre au tap sur un résultat', async () => {
    const { getPathname } = await renderSearch();
    const user = await searchFor('dune');

    await user.press(await screen.findByText('Dune 1'));

    expect(await screen.findByText('412 pages')).toBeOnTheScreen();
    expect(getPathname()).toBe('/book/9780000000001');
  });
});
