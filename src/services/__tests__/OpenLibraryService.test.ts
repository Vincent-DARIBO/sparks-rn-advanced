import { http, HttpResponse } from 'msw';

import { AppError } from '@/errors/AppError';
import { BookNotFoundError, OpenLibraryError } from '@/errors/OpenLibraryError';
import {
  NOT_FOUND_ISBN,
  OPEN_LIBRARY_URL,
  SERVER_ERROR_ISBN,
  SERVER_ERROR_QUERY,
} from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { OpenLibraryService } from '@/services/OpenLibraryService';

describe('OpenLibraryService.getByIsbn', () => {
  it('retourne le livre converti depuis la réponse Open Library', async () => {
    await expect(OpenLibraryService.getByIsbn('9780441013593')).resolves.toEqual({
      isbn: '9780441013593',
      title: 'Dune',
      author: 'Frank Herbert',
      numberOfPages: 412,
    });
  });

  it('utilise des valeurs par défaut quand la réponse est incomplète', async () => {
    server.use(http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, () => HttpResponse.json({})));

    await expect(OpenLibraryService.getByIsbn('9780441013593')).resolves.toEqual({
      isbn: '9780441013593',
      title: 'Sans titre',
      author: 'Auteur inconnu',
      numberOfPages: undefined,
    });
  });

  it('lève BookNotFoundError sur un 404', async () => {
    const error = await OpenLibraryService.getByIsbn(NOT_FOUND_ISBN).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BookNotFoundError);
    expect((error as AppError).userMessage).toBe('Livre introuvable');
  });

  it('lève OpenLibraryError sur un 500 en conservant le statut', async () => {
    const error = await OpenLibraryService.getByIsbn(SERVER_ERROR_ISBN).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(OpenLibraryError);
    expect((error as AppError).code).toBe('request_failed');
    expect((error as AppError).technicalDetails).toEqual({ status: 500 });
  });

  it('lève OpenLibraryError quand le réseau échoue', async () => {
    server.use(http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, () => HttpResponse.error()));

    await expect(OpenLibraryService.getByIsbn('9780441013593')).rejects.toBeInstanceOf(
      OpenLibraryError,
    );
  });
});

describe('OpenLibraryService.search', () => {
  it('retourne la première page avec hasMore à vrai', async () => {
    const page = await OpenLibraryService.search('dune', 1);

    expect(page.page).toBe(1);
    expect(page.results).toHaveLength(20);
    expect(page.hasMore).toBe(true);
    expect(page.results[0]).toEqual({
      key: '/works/OL1W',
      title: 'Dune 1',
      author: 'Frank Herbert',
      isbn: '9780000000001',
    });
  });

  it('retourne la dernière page avec hasMore à faux', async () => {
    const page = await OpenLibraryService.search('dune', 2);

    expect(page.page).toBe(2);
    expect(page.results).toHaveLength(10);
    expect(page.hasMore).toBe(false);
    expect(page.results[0].title).toBe('Dune 21');
  });

  it('encode la requête et transmet la pagination', async () => {
    let receivedUrl: URL | undefined;
    server.use(
      http.get(`${OPEN_LIBRARY_URL}/search.json`, ({ request }) => {
        receivedUrl = new URL(request.url);
        return HttpResponse.json({ docs: [], numFound: 0, start: 0 });
      }),
    );

    await OpenLibraryService.search('le petit prince & co', 3);

    expect(receivedUrl?.searchParams.get('q')).toBe('le petit prince & co');
    expect(receivedUrl?.searchParams.get('page')).toBe('3');
    expect(receivedUrl?.searchParams.get('limit')).toBe('20');
    expect(receivedUrl?.searchParams.get('fields')).toBe('key,title,author_name,isbn');
  });

  it('préfère un ISBN 978 et gère les valeurs manquantes', async () => {
    server.use(
      http.get(`${OPEN_LIBRARY_URL}/search.json`, () =>
        HttpResponse.json({
          docs: [
            { key: '/works/A', title: 'A', author_name: ['X', 'Y'], isbn: ['1234567890', '9781234567897'] },
            { key: '/works/B', isbn: ['1234567890'] },
            { key: '/works/C' },
          ],
          numFound: 3,
          start: 0,
        }),
      ),
    );

    const page = await OpenLibraryService.search('abc', 1);

    expect(page.results).toEqual([
      { key: '/works/A', title: 'A', author: 'X', isbn: '9781234567897' },
      { key: '/works/B', title: 'Sans titre', author: 'Auteur inconnu', isbn: '1234567890' },
      { key: '/works/C', title: 'Sans titre', author: 'Auteur inconnu', isbn: undefined },
    ]);
    expect(page.hasMore).toBe(false);
  });

  it('lève OpenLibraryError sur un 500', async () => {
    await expect(OpenLibraryService.search(SERVER_ERROR_QUERY, 1)).rejects.toBeInstanceOf(
      OpenLibraryError,
    );
  });

  it('lève OpenLibraryError quand le réseau échoue', async () => {
    server.use(http.get(`${OPEN_LIBRARY_URL}/search.json`, () => HttpResponse.error()));

    await expect(OpenLibraryService.search('dune', 1)).rejects.toBeInstanceOf(OpenLibraryError);
  });
});
