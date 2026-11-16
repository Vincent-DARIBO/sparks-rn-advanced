import { useMemo } from 'react';

import { ScanFeedbackService } from '@/services/ScanFeedbackService';

type RuntimeGlobal = {
  HermesInternal?: {
    getRuntimeProperties?: () => Record<string, string>;
  };
  nativeFabricUIManager?: unknown;
};

function readDeviceModel(): string {
  try {
    return ScanFeedbackService.getDeviceModel();
  } catch {
    return 'n/a';
  }
}

export default function useRuntimeInfo() {
  const runtimeGlobal = globalThis as unknown as RuntimeGlobal;
  const hermesInternal = runtimeGlobal.HermesInternal;
  const deviceModel = useMemo(() => readDeviceModel(), []);

  return {
    isHermesEnabled: hermesInternal != null,
    hermesVersion: hermesInternal?.getRuntimeProperties?.()['OSS Release Version'] ?? 'n/a',
    isFabricEnabled: runtimeGlobal.nativeFabricUIManager != null,
    deviceModel,
  };
}
