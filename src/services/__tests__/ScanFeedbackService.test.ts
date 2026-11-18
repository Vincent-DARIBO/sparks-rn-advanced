import ScanFeedback from 'react-native-scan-feedback';

import { ScanFeedbackError } from '@/errors/ScanFeedbackError';
import { ScanFeedbackService } from '@/services/ScanFeedbackService';

const mockedScanFeedback = jest.mocked(ScanFeedback);

describe('ScanFeedbackService.vibrate', () => {
  it('délègue la vibration au module natif avec la durée demandée', async () => {
    await ScanFeedbackService.vibrate(80);

    expect(mockedScanFeedback.vibrate).toHaveBeenCalledWith(80);
  });

  it('lève ScanFeedbackError quand le module natif échoue', async () => {
    mockedScanFeedback.vibrate.mockRejectedValueOnce(new Error('indisponible'));

    const error = await ScanFeedbackService.vibrate(80).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ScanFeedbackError);
    expect((error as ScanFeedbackError).code).toBe('vibration_failed');
  });
});

describe('ScanFeedbackService.getDeviceModel', () => {
  it('retourne le modèle fourni par le module natif', () => {
    expect(ScanFeedbackService.getDeviceModel()).toBe('Test Device');
  });

  it('lève ScanFeedbackError quand le module natif échoue', () => {
    mockedScanFeedback.getDeviceModel.mockImplementationOnce(() => {
      throw new Error('indisponible');
    });

    expect(() => ScanFeedbackService.getDeviceModel()).toThrow(ScanFeedbackError);
  });
});
