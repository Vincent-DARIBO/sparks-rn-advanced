import { NativeModule, requireNativeModule } from 'expo';

declare class ScanFeedbackExpoModule extends NativeModule {
  vibrate(durationMs: number): Promise<void>;
  getDeviceModel(): string;
}

export default requireNativeModule<ScanFeedbackExpoModule>('ScanFeedbackExpo');
