import { http, HttpResponse } from 'msw';

export const OPEN_LIBRARY_URL = 'https://openlibrary.org';

export const NOT_FOUND_ISBN = '0000000000000';
export const SERVER_ERROR_ISBN = '5000000000000';
export const SERVER_ERROR_QUERY = 'erreur';
export const SEARCH_TOTAL = 30;

const DUNE = {
  title: 'Dune',
  by_statement: 'Frank Herbert',
  number_of_pages: 412,
};

function buildSearchDocs(start: number, limit: number) {
  const count = Math.max(0, Math.min(limit, SEARCH_TOTAL - start));
  return Array.from({ length: count }, (_, offset) => {
    const position = start + offset + 1;
    return {
      key: `/works/OL${position}W`,
      title: `Dune ${position}`,
      author_name: ['Frank Herbert'],
      isbn: [`978000000${String(position).padStart(4, '0')}`],
    };
  });
}

export const handlers = [
  http.get(`${OPEN_LIBRARY_URL}/isbn/:isbn`, ({ params }) => {
    const isbn = String(params.isbn).replace(/\.json$/, '');
    if (isbn === NOT_FOUND_ISBN) return new HttpResponse(null, { status: 404 });
    if (isbn === SERVER_ERROR_ISBN) return new HttpResponse(null, { status: 500 });
    return HttpResponse.json(DUNE);
  }),

  http.get(`${OPEN_LIBRARY_URL}/search.json`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get('q') === SERVER_ERROR_QUERY) {
      return new HttpResponse(null, { status: 500 });
    }
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const start = (page - 1) * limit;
    return HttpResponse.json({
      docs: buildSearchDocs(start, limit),
      numFound: SEARCH_TOTAL,
      start,
    });
  }),
];
