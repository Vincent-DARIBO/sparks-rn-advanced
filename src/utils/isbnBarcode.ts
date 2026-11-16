type ScannedBarcode = {
  format: string;
  rawValue?: string;
};

const ISBN_BARCODE_FORMAT = 'ean-13';
const ISBN_BARCODE_PREFIXES = ['978', '979'];

export function findIsbnInBarcodes(barcodes: ScannedBarcode[]): string | null {
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
