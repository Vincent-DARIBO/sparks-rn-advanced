const BASE_URL = 'https://openlibrary.org';

export function coverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

export async function fetchBookByIsbn(isbn: string): Promise<Response> {
  const url = `${BASE_URL}/isbn/${isbn}.json`;
  console.log('fetchBookByIsbn', url);
  const res = await fetch(url);
  console.log('fetchBookByIsbn status', res.status);
  return res;
}

export async function searchBooks(query: string, page = 1): Promise<Response> {
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=20&fields=key,title,author_name,isbn`;
  console.log('searchBooks', url);
  const res = await fetch(url);
  console.log('searchBooks status', res.status);
  return res;
}
