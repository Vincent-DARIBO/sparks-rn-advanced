import { AppError } from '@/errors/AppError';

export class OpenLibraryError extends AppError {
  static requestFailed(technicalDetails?: unknown): OpenLibraryError {
    return new OpenLibraryError(
      'request_failed',
      'Impossible de joindre Open Library',
      'request_failed',
      technicalDetails,
    );
  }

  static invalidResponse(technicalDetails?: unknown): OpenLibraryError {
    return new OpenLibraryError(
      'invalid_response',
      'Réponse inattendue d’Open Library',
      'invalid_response',
      technicalDetails,
    );
  }
}

export class BookNotFoundError extends AppError {
  constructor(isbn: string) {
    super(`book_not_found:${isbn}`, 'Livre introuvable', 'book_not_found', { isbn });
  }
}
