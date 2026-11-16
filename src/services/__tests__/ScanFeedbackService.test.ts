import ScanFeedback from 'react-native-scan-feedback';

import { ScanFeedbackError } from '@/errors/ScanFeedbackError';
import { ScanFeedbackService } from '@/services/ScanFeedbackService';

jest.mock('react-native-scan-feedback', () => ({
  __esModule: true,
  default: { vibrate: jest.fn(), getDeviceModel: jest.fn() },
}));

const mockedNativeModule = jest.mocked(ScanFeedback);

describe('ScanFeedbackService', () => {
  it('délègue la vibration au module natif', async () => {
    mockedNativeModule.vibrate.mockResolvedValue(undefined);
    await ScanFeedbackService.vibrate(80);
    expect(mockedNativeModule.vibrate).toHaveBeenCalledWith(80);
  });

  it('relance une ScanFeedbackError si la vibration échoue', async () => {
    mockedNativeModule.vibrate.mockRejectedValue(new Error('native'));
    await expect(ScanFeedbackService.vibrate(80)).rejects.toBeInstanceOf(ScanFeedbackError);
  });

  it('retourne le modèle de l’appareil', () => {
    mockedNativeModule.getDeviceModel.mockReturnValue('Google Pixel 9');
    expect(ScanFeedbackService.getDeviceModel()).toBe('Google Pixel 9');
  });

  it('relance une ScanFeedbackError si la lecture du modèle échoue', () => {
    mockedNativeModule.getDeviceModel.mockImplementation(() => {
      throw new Error('native');
    });
    expect(() => ScanFeedbackService.getDeviceModel()).toThrow(ScanFeedbackError);
  });
});
