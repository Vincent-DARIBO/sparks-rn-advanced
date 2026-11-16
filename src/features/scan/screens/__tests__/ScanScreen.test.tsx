import { screen, userEvent } from '@testing-library/react-native';

import BookDetailScreen from '@/features/book/screens/BookDetailScreen';
import ScanScreen from '@/features/scan/screens/ScanScreen';
import renderRouterWithProviders from '@/test-utils/renderRouterWithProviders';

async function renderScan() {
  return renderRouterWithProviders({ index: ScanScreen, 'book/[isbn]': BookDetailScreen }, '/');
}

async function submitIsbn(isbn: string) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Saisir un ISBN'), isbn);
  await user.press(screen.getByRole('button', { name: 'Rechercher' }));
}

describe('ScanScreen', () => {
  it('ouvre le Détail du livre après la saisie d’un ISBN valide', async () => {
    const { getPathname } = await renderScan();

    await submitIsbn('978-0-441-01359-3');

    expect(await screen.findByText('412 pages')).toBeOnTheScreen();
    expect(getPathname()).toBe('/book/9780441013593');
  });

  it('affiche une erreur et reste sur l’écran de scan pour un ISBN invalide', async () => {
    const { getPathname } = await renderScan();

    await submitIsbn('9780441013594');

    expect(await screen.findByText('ISBN invalide')).toBeOnTheScreen();
    expect(getPathname()).toBe('/');
  });
});
