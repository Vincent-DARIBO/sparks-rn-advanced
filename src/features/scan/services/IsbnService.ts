import type { ScannedBarcode } from '@/features/scan/types/scan.types';

const ISBN_BARCODE_FORMAT = 'ean-13';
const ISBN_BARCODE_PREFIXES = ['978', '979'];

export class IsbnService {
  static normalize(raw: string): string {
    return raw.replace(/[-\s]/g, '').toUpperCase();
  }

  static isValidIsbn10(isbn: string): boolean {
    if (!/^\d{9}[\dX]$/.test(isbn)) return false;
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const char = isbn[i];
      const value = char === 'X' ? 10 : Number(char);
      sum += value * (10 - i);
    }
    return sum % 11 === 0;
  }

  static isValidIsbn13(isbn: string): boolean {
    if (!/^\d{13}$/.test(isbn)) return false;
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    }
    return sum % 10 === 0;
  }

  static isValid(raw: string): boolean {
    const isbn = IsbnService.normalize(raw);
    if (isbn.length === 10) return IsbnService.isValidIsbn10(isbn);
    if (isbn.length === 13) return IsbnService.isValidIsbn13(isbn);
    return false;
  }

  static findIsbnInBarcodes(barcodes: ScannedBarcode[]): string | null {
    for (const barcode of barcodes) {
      const value = barcode.rawValue;
      const isIsbnBarcode =
        barcode.format === ISBN_BARCODE_FORMAT &&
        value !== undefined &&
        ISBN_BARCODE_PREFIXES.some((prefix) => value.startsWith(prefix));
      if (isIsbnBarcode) return value;
    }
    return null;
  }
}
