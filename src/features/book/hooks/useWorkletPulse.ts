import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PULSE_SCALE = 1.5;
const PULSE_HALF_DURATION_MS = 400;

export default function useWorkletPulse() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(PULSE_SCALE, { duration: PULSE_HALF_DURATION_MS }),
        withTiming(1, { duration: PULSE_HALF_DURATION_MS })
      ),
      -1
    );
  }, [scale]);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return { pulseStyle };
}
