import seed from '@/data/books.seed.json';
import type { StorageError } from '@/errors/StorageError';
import type { Book } from '@/types/book.types';

type LibraryServiceClass = typeof import('@/features/library/services/LibraryService').LibraryService;

const DUNE: Book = { isbn: '9780441013593', title: 'Dune', author: 'Frank Herbert', numberOfPages: 412 };
const NEUROMANCER: Book = { isbn: '9780441569595', title: 'Neuromancer', author: 'William Gibson' };

function loadLibraryService(): LibraryServiceClass {
  jest.resetModules();
  return jest.requireActual<typeof import('@/features/library/services/LibraryService')>(
    '@/features/library/services/LibraryService',
  ).LibraryService;
}

function loadLibraryServiceWithStorage(storage: {
  getString: () => string | undefined;
  set: () => void;
}): LibraryServiceClass {
  jest.resetModules();
  jest.doMock('react-native-mmkv', () => ({ createMMKV: () => storage }));
  return jest.requireActual<typeof import('@/features/library/services/LibraryService')>(
    '@/features/library/services/LibraryService',
  ).LibraryService;
}

afterEach(() => {
  jest.dontMock('react-native-mmkv');
});

describe('LibraryService.getAddedBooks', () => {
  it('retourne une liste vide quand rien n’a été ajouté', async () => {
    const LibraryService = loadLibraryService();

    await expect(LibraryService.getAddedBooks()).resolves.toEqual([]);
  });

  it('retourne les livres ajoutés, le plus récent en premier', async () => {
    const LibraryService = loadLibraryService();

    await LibraryService.addBook(DUNE);
    await LibraryService.addBook(NEUROMANCER);

    await expect(LibraryService.getAddedBooks()).resolves.toEqual([NEUROMANCER, DUNE]);
  });

  it('lève StorageError.readFailed quand le contenu stocké est illisible', async () => {
    const LibraryService = loadLibraryServiceWithStorage({
      getString: () => '{illisible',
      set: jest.fn(),
    });

    const error = await LibraryService.getAddedBooks().catch((e: unknown) => e);

    expect((error as StorageError).name).toBe('StorageError');
    expect((error as StorageError).code).toBe('read_failed');
  });
});

describe('LibraryService.addBook', () => {
  it('retourne le livre ajouté', async () => {
    const LibraryService = loadLibraryService();

    await expect(LibraryService.addBook(DUNE)).resolves.toEqual(DUNE);
  });

  it('n’ajoute pas deux fois le même ISBN', async () => {
    const LibraryService = loadLibraryService();

    await LibraryService.addBook(DUNE);
    await LibraryService.addBook({ ...DUNE, title: 'Dune (réédition)' });

    await expect(LibraryService.getAddedBooks()).resolves.toEqual([DUNE]);
  });

  it('lève StorageError.writeFailed quand l’écriture échoue', async () => {
    const LibraryService = loadLibraryServiceWithStorage({
      getString: () => undefined,
      set: () => {
        throw new Error('disque plein');
      },
    });

    const error = await LibraryService.addBook(DUNE).catch((e: unknown) => e);

    expect((error as StorageError).name).toBe('StorageError');
    expect((error as StorageError).code).toBe('write_failed');
  });
});

describe('LibraryService.getSeedBooks', () => {
  it('retourne les livres du jeu de données embarqué', async () => {
    const LibraryService = loadLibraryService();

    expect(LibraryService.getSeedBooks()).toEqual(seed);
    expect(LibraryService.getSeedBooks().length).toBeGreaterThan(0);
  });
});
