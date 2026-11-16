type RuntimeGlobal = {
  HermesInternal?: {
    getRuntimeProperties?: () => Record<string, string>;
  };
  nativeFabricUIManager?: unknown;
};

export default function useRuntimeInfo() {
  const runtimeGlobal = globalThis as unknown as RuntimeGlobal;
  const hermesInternal = runtimeGlobal.HermesInternal;

  return {
    isHermesEnabled: hermesInternal != null,
    hermesVersion: hermesInternal?.getRuntimeProperties?.()['OSS Release Version'] ?? 'n/a',
    isFabricEnabled: runtimeGlobal.nativeFabricUIManager != null,
  };
}
