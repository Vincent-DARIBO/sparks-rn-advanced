import { AppError } from '@/errors/AppError';

export class ScanFeedbackError extends AppError {
  static vibrationFailed(technicalDetails?: unknown): ScanFeedbackError {
    return new ScanFeedbackError(
      'vibration_failed',
      'Impossible de faire vibrer l’appareil',
      'vibration_failed',
      technicalDetails
    );
  }

  static deviceModelUnavailable(technicalDetails?: unknown): ScanFeedbackError {
    return new ScanFeedbackError(
      'device_model_unavailable',
      'Impossible de lire le modèle de l’appareil',
      'device_model_unavailable',
      technicalDetails
    );
  }
}
