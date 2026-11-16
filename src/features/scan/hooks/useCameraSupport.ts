import { isDevice } from 'expo-device';
import { Platform } from 'react-native';

export default function useCameraSupport() {
  const isIosSimulator = Platform.OS === 'ios' && !isDevice;

  return { isCameraSupported: !isIosSimulator };
}
