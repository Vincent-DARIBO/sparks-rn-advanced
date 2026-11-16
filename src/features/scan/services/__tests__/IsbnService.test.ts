import { IsbnService } from '@/features/scan/services/IsbnService';

describe('IsbnService.normalize', () => {
  it('retire les tirets et les espaces', () => {
    expect(IsbnService.normalize('978-0-441-01359-3')).toBe('9780441013593');
    expect(IsbnService.normalize(' 0 441 01359 7 ')).toBe('0441013597');
  });

  it('met les lettres en majuscules', () => {
    expect(IsbnService.normalize('04410a3597')).toBe('04410A3597');
  });
});

describe('IsbnService.isValidIsbn10', () => {
  it('accepte un ISBN-10 valide', () => {
    expect(IsbnService.isValidIsbn10('0441013597')).toBe(true);
  });

  it('accepte un ISBN-10 dont la clé de contrôle est X', () => {
    expect(IsbnService.isValidIsbn10('080442957X')).toBe(true);
  });

  it('refuse un ISBN-10 terminé par X dont la clé de contrôle est fausse', () => {
    expect(IsbnService.isValidIsbn10('080442958X')).toBe(false);
  });

  it('refuse un ISBN-10 dont la clé de contrôle est fausse', () => {
    expect(IsbnService.isValidIsbn10('0441013598')).toBe(false);
  });

  it('refuse un ISBN-10 contenant une lettre hors dernière position', () => {
    expect(IsbnService.isValidIsbn10('04410A3597')).toBe(false);
    expect(IsbnService.isValidIsbn10('X441013597')).toBe(false);
  });

  it('refuse une longueur incorrecte', () => {
    expect(IsbnService.isValidIsbn10('044101359')).toBe(false);
    expect(IsbnService.isValidIsbn10('04410135970')).toBe(false);
  });
});

describe('IsbnService.isValidIsbn13', () => {
  it('accepte un ISBN-13 valide', () => {
    expect(IsbnService.isValidIsbn13('9780441013593')).toBe(true);
    expect(IsbnService.isValidIsbn13('9782070368228')).toBe(true);
  });

  it('refuse un ISBN-13 dont la clé de contrôle est fausse', () => {
    expect(IsbnService.isValidIsbn13('9780441013594')).toBe(false);
  });

  it('refuse un ISBN-13 contenant une lettre', () => {
    expect(IsbnService.isValidIsbn13('978044101359X')).toBe(false);
  });

  it('refuse une longueur incorrecte', () => {
    expect(IsbnService.isValidIsbn13('978044101359')).toBe(false);
    expect(IsbnService.isValidIsbn13('97804410135930')).toBe(false);
  });
});

describe('IsbnService.isValid', () => {
  it('valide un ISBN-10 et un ISBN-13 bruts', () => {
    expect(IsbnService.isValid('0441013597')).toBe(true);
    expect(IsbnService.isValid('9780441013593')).toBe(true);
  });

  it('valide un ISBN-10 terminé par X, en majuscule ou en minuscule', () => {
    expect(IsbnService.isValid('080442957X')).toBe(true);
    expect(IsbnService.isValid('0-8044-2957-x')).toBe(true);
  });

  it('valide un ISBN saisi avec tirets et espaces', () => {
    expect(IsbnService.isValid('978-0-441-01359-3')).toBe(true);
    expect(IsbnService.isValid('0 441 01359 7')).toBe(true);
  });

  it('refuse une clé de contrôle fausse', () => {
    expect(IsbnService.isValid('0441013598')).toBe(false);
    expect(IsbnService.isValid('9780441013594')).toBe(false);
  });

  it('refuse une longueur qui n’est ni 10 ni 13', () => {
    expect(IsbnService.isValid('')).toBe(false);
    expect(IsbnService.isValid('978044101')).toBe(false);
    expect(IsbnService.isValid('97804410135')).toBe(false);
    expect(IsbnService.isValid('978044101359312')).toBe(false);
  });
});

describe('IsbnService.findIsbnInBarcodes', () => {
  it('retourne la valeur d’un EAN-13 commençant par 978', () => {
    expect(IsbnService.findIsbnInBarcodes([{ format: 'ean-13', rawValue: '9780441013593' }])).toBe(
      '9780441013593',
    );
  });

  it('retourne la valeur d’un EAN-13 commençant par 979', () => {
    expect(IsbnService.findIsbnInBarcodes([{ format: 'ean-13', rawValue: '9791234567896' }])).toBe(
      '9791234567896',
    );
  });

  it('ignore un EAN-13 avec un autre préfixe', () => {
    expect(
      IsbnService.findIsbnInBarcodes([{ format: 'ean-13', rawValue: '3017620422003' }]),
    ).toBeNull();
  });

  it('ignore un code-barres d’un autre format', () => {
    expect(
      IsbnService.findIsbnInBarcodes([{ format: 'qr-code', rawValue: '9780441013593' }]),
    ).toBeNull();
  });

  it('ignore un code-barres sans valeur', () => {
    expect(IsbnService.findIsbnInBarcodes([{ format: 'ean-13' }])).toBeNull();
  });

  it('retourne le premier code-barres ISBN parmi plusieurs', () => {
    expect(
      IsbnService.findIsbnInBarcodes([
        { format: 'ean-13', rawValue: '3017620422003' },
        { format: 'ean-13', rawValue: '9780441013593' },
        { format: 'ean-13', rawValue: '9782070368228' },
      ]),
    ).toBe('9780441013593');
  });

  it('retourne null quand la liste est vide', () => {
    expect(IsbnService.findIsbnInBarcodes([])).toBeNull();
  });
});
