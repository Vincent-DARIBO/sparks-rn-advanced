export type CoverSize = 'S' | 'M' | 'L';

export function coverUrl(isbn: string, size: CoverSize = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}
