import { StyleSheet, Text, View } from 'react-native';
import { CodeScanner } from 'react-native-vision-camera-barcode-scanner';

import useIsbnScanner from '@/hooks/useIsbnScanner';

export default function IsbnCamera() {
  const {
    hasCameraPermission,
    hasCameraDevice,
    isScannerActive,
    scannerErrorMessage,
    handleBarcodesScanned,
    handleScannerError,
  } = useIsbnScanner();

  if (!hasCameraPermission) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Accès à la caméra refusé : utilisez la saisie manuelle ci-dessous.
        </Text>
      </View>
    );
  }

  if (!hasCameraDevice) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Aucune caméra disponible : utilisez la saisie manuelle ci-dessous.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <CodeScanner
        style={StyleSheet.absoluteFill}
        isActive={isScannerActive}
        barcodeFormats={['ean-13']}
        onBarcodeScanned={handleBarcodesScanned}
        onError={handleScannerError}
      />
      {scannerErrorMessage ? <Text style={styles.error}>{scannerErrorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: { height: 280, backgroundColor: '#000' },
  placeholder: {
    height: 120,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f2f2f7',
  },
  placeholderText: { textAlign: 'center', color: '#444' },
  error: { position: 'absolute', bottom: 8, left: 8, right: 8, color: '#fff' },
});
