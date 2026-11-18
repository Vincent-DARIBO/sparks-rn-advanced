import { server } from '@/mocks/server';

jest.mock('react-native-scan-feedback', () => ({
  __esModule: true,
  default: {
    vibrate: jest.fn().mockResolvedValue(undefined),
    getDeviceModel: jest.fn(() => 'Test Device'),
  },
}));

jest.mock('expo-device', () => ({ isDevice: false }));

jest.mock('react-native-vision-camera', () => ({
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    canRequestPermission: false,
    requestPermission: jest.fn().mockResolvedValue(true),
  })),
  useCameraDevice: jest.fn(() => ({ id: 'back' })),
}));

jest.mock('react-native-vision-camera-barcode-scanner', () => ({
  CodeScanner: () => null,
}));

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: { createHybridObject: jest.fn() },
}));

jest.mock('@react-native-community/netinfo', () =>
  jest.requireActual('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
