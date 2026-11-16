import ScanFeedbackExpo from '../../modules/scan-feedback-expo';

import { ScanFeedbackError } from '@/errors/ScanFeedbackError';

export class ScanFeedbackService {
  static async vibrate(durationMs: number): Promise<void> {
    try {
      await ScanFeedbackExpo.vibrate(durationMs);
    } catch (error) {
      throw ScanFeedbackError.vibrationFailed(error);
    }
  }

  static getDeviceModel(): string {
    try {
      return ScanFeedbackExpo.getDeviceModel();
    } catch (error) {
      throw ScanFeedbackError.deviceModelUnavailable(error);
    }
  }
}
