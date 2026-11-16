import { StyleSheet, Text, View } from 'react-native';
import { CodeScanner } from 'react-native-vision-camera-barcode-scanner';

import CameraPlaceholder from '@/components/CameraPlaceholder';
import useIsbnScanner from '@/hooks/useIsbnScanner';

export default function IsbnScannerView() {
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
      <CameraPlaceholder message="Accès à la caméra refusé : utilisez la saisie manuelle ci-dessous." />
    );
  }

  if (!hasCameraDevice) {
    return (
      <CameraPlaceholder message="Aucune caméra disponible : utilisez la saisie manuelle ci-dessous." />
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
  error: { position: 'absolute', bottom: 8, left: 8, right: 8, color: '#fff' },
});
