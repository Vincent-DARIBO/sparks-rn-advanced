import { lazy, Suspense } from 'react';

import CameraPlaceholder from '@/features/scan/components/CameraPlaceholder';
import useCameraSupport from '@/features/scan/hooks/useCameraSupport';

const IsbnScannerView = lazy(() => import('@/features/scan/components/IsbnScannerView'));

export default function IsbnCamera() {
  const { isCameraSupported } = useCameraSupport();

  if (!isCameraSupported) {
    return (
      <CameraPlaceholder message="Caméra indisponible sur simulateur : utilisez la saisie manuelle ci-dessous." />
    );
  }

  return (
    <Suspense fallback={null}>
      <IsbnScannerView />
    </Suspense>
  );
}
