import { screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import BookDetailScreen from '@/features/book/screens/BookDetailScreen';
import { LibraryService } from '@/features/library/services/LibraryService';
import { NOT_FOUND_ISBN, OPEN_LIBRARY_URL, SERVER_ERROR_ISBN } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import renderRouterWithProviders from '@/test-utils/renderRouterWithProviders';

const DUNE_ISBN = '9780441013593';

async function renderDetail(isbn: string) {
  return renderRouterWithProviders({ 'book/[isbn]': BookDetailScreen }, `/book/${isbn}`);
}

describe('BookDetailScreen', () => {
  it('affiche le chargement puis le livre', async () => {
    await renderDetail(DUNE_ISBN);

    expect(screen.getByText('Chargement…')).toBeOnTheScreen();
    expect(await screen.findByText('Dune')).toBeOnTheScreen();
    expect(screen.queryByText('Chargement…')).not.toBeOnTheScreen();
  });

  it('affiche le nombre de pages et le bouton d’ajout', async () => {
    await renderDetail(DUNE_ISBN);

    expect(await screen.findByText('412 pages')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Ajouter à ma bibliothèque' })).toBeOnTheScreen();
  });

  it('indique un nombre de pages inconnu quand Open Library ne le fournit pas', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, () => HttpResponse.json({ title: 'Dune' })),
    );

    await renderDetail(DUNE_ISBN);

    expect(await screen.findByText('Nombre de pages inconnu')).toBeOnTheScreen();
  });

  it('affiche « Livre introuvable » sans bouton de nouvelle tentative sur un 404', async () => {
    await renderDetail(NOT_FOUND_ISBN);

    expect(await screen.findByText('Livre introuvable')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeOnTheScreen();
  });

  it('affiche une erreur avec un bouton « Réessayer » sur une erreur serveur', async () => {
    await renderDetail(SERVER_ERROR_ISBN);

    expect(await screen.findByText('Une erreur est survenue')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeOnTheScreen();
  });

  it('relance la requête quand on appuie sur « Réessayer »', async () => {
    const user = userEvent.setup();
    server.use(http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, () => new HttpResponse(null, { status: 500 })));
    await renderDetail(DUNE_ISBN);
    const retryButton = await screen.findByRole('button', { name: 'Réessayer' });

    server.use(
      http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, () =>
        HttpResponse.json({ title: 'Dune', number_of_pages: 412 }),
      ),
    );
    await user.press(retryButton);

    expect(await screen.findByText('Dune')).toBeOnTheScreen();
    expect(screen.queryByText('Une erreur est survenue')).not.toBeOnTheScreen();
  });

  it('affiche « Ajouté à la bibliothèque » et désactive le bouton pour un livre déjà présent', async () => {
    await LibraryService.addBook({ isbn: DUNE_ISBN, title: 'Dune', author: 'Frank Herbert' });

    await renderDetail(DUNE_ISBN);

    const addedButton = await screen.findByRole('button', { name: 'Ajouté à la bibliothèque' });
    expect(addedButton).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Ajouter à ma bibliothèque' })).not.toBeOnTheScreen();
  });
});
