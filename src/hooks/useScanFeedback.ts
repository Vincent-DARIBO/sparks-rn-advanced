import { ScanFeedbackService } from '@/services/ScanFeedbackService';

const SUCCESS_VIBRATION_DURATION_MS = 80;

export default function useScanFeedback() {
  const vibrateOnSuccess = async () => {
    try {
      await ScanFeedbackService.vibrate(SUCCESS_VIBRATION_DURATION_MS);
    } catch {
      return;
    }
  };

  return { vibrateOnSuccess };
}
