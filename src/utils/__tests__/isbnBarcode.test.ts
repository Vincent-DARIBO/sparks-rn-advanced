import { findIsbnInBarcodes } from '@/utils/isbnBarcode';

describe('findIsbnInBarcodes', () => {
  it('retient un EAN-13 en 978', () => {
    expect(findIsbnInBarcodes([{ format: 'ean-13', rawValue: '9782070612758' }])).toBe(
      '9782070612758'
    );
  });

  it('retient un EAN-13 en 979', () => {
    expect(findIsbnInBarcodes([{ format: 'ean-13', rawValue: '9791032700000' }])).toBe(
      '9791032700000'
    );
  });

  it('ignore un EAN-13 hors préfixe ISBN', () => {
    expect(findIsbnInBarcodes([{ format: 'ean-13', rawValue: '3017620422003' }])).toBeNull();
  });

  it('ignore les autres formats', () => {
    expect(findIsbnInBarcodes([{ format: 'qr-code', rawValue: '9782070612758' }])).toBeNull();
  });

  it('ignore un code sans valeur', () => {
    expect(findIsbnInBarcodes([{ format: 'ean-13' }])).toBeNull();
  });

  it('retourne le premier code valide parmi plusieurs', () => {
    expect(
      findIsbnInBarcodes([
        { format: 'qr-code', rawValue: 'x' },
        { format: 'ean-13', rawValue: '9782070612758' },
      ])
    ).toBe('9782070612758');
  });
});
