import ScanFeedback from 'react-native-scan-feedback';

import { ScanFeedbackError } from '@/errors/ScanFeedbackError';

export class ScanFeedbackService {
  static async vibrate(durationMs: number): Promise<void> {
    try {
      await ScanFeedback.vibrate(durationMs);
    } catch (error) {
      throw ScanFeedbackError.vibrationFailed(error);
    }
  }

  static getDeviceModel(): string {
    try {
      return ScanFeedback.getDeviceModel();
    } catch (error) {
      throw ScanFeedbackError.deviceModelUnavailable(error);
    }
  }
}
