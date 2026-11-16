import { AppError } from '@/errors/AppError';

export class StorageError extends AppError {
  static readFailed(technicalDetails?: unknown): StorageError {
    return new StorageError(
      'read_failed',
      'Impossible de lire les données stockées',
      'read_failed',
      technicalDetails,
    );
  }

  static writeFailed(technicalDetails?: unknown): StorageError {
    return new StorageError(
      'write_failed',
      'Impossible d’enregistrer les données',
      'write_failed',
      technicalDetails,
    );
  }
}
