import { useFocusEffect, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import type { Barcode } from 'react-native-vision-camera-barcode-scanner';

import useBookNavigation from '@/hooks/useBookNavigation';
import useScanFeedback from '@/hooks/useScanFeedback';
import { findIsbnInBarcodes } from '@/utils/isbnBarcode';

export default function useIsbnScanner() {
  const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();
  const cameraDevice = useCameraDevice('back');
  const isScreenFocused = useIsFocused();
  const { openBookDetail } = useBookNavigation();
  const { vibrateOnSuccess } = useScanFeedback();
  const [hasScannedIsbn, setHasScannedIsbn] = useState(false);
  const [scannerErrorMessage, setScannerErrorMessage] = useState<string | null>(null);
  const isIsbnHandledRef = useRef(false);

  useEffect(() => {
    if (canRequestPermission) {
      void requestPermission();
    }
  }, [canRequestPermission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      isIsbnHandledRef.current = false;
      setHasScannedIsbn(false);
    }, [])
  );

  const handleBarcodesScanned = (barcodes: Barcode[]) => {
    if (isIsbnHandledRef.current) return;
    const isbn = findIsbnInBarcodes(barcodes);
    if (isbn === null) return;
    isIsbnHandledRef.current = true;
    setHasScannedIsbn(true);
    void vibrateOnSuccess();
    openBookDetail(isbn);
  };

  const handleScannerError = (error: Error) => {
    setScannerErrorMessage(error.message);
  };

  return {
    hasCameraPermission: hasPermission,
    hasCameraDevice: cameraDevice !== undefined,
    isScannerActive: isScreenFocused && !hasScannedIsbn,
    scannerErrorMessage,
    handleBarcodesScanned,
    handleScannerError,
  };
}
