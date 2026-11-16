import { useRef, type ComponentRef } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FLIGHT_END_SCALE,
  FLIGHT_FADE_DELAY_MS,
  FLIGHT_FADE_DURATION_MS,
  LIBRARY_TAB_INDEX,
  TAB_BAR_HEIGHT,
  TAB_COUNT,
} from '@/features/book/types/addedBookFlight.types';

export default function useAddedBookFlight(onAdd: () => void) {
  const coverRef = useRef<ComponentRef<typeof Animated.View>>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const targetX = (width / TAB_COUNT) * (LIBRARY_TAB_INDEX + 0.5);
  const targetY = height - insets.bottom - TAB_BAR_HEIGHT / 2;

  const startFlight = (coverX: number, coverY: number, coverWidth: number, coverHeight: number) => {
    translateX.value = withSpring(targetX - (coverX + coverWidth / 2));
    translateY.value = withSpring(targetY - (coverY + coverHeight / 2));
    scale.value = withSpring(FLIGHT_END_SCALE);
    opacity.value = withDelay(
      FLIGHT_FADE_DELAY_MS,
      withTiming(0, { duration: FLIGHT_FADE_DURATION_MS }, (finished) => {
        'worklet';
        if (!finished) return;
        translateX.value = 0;
        translateY.value = 0;
        scale.value = 1;
        opacity.value = withTiming(1);
      })
    );
  };

  const addWithFlight = () => {
    onAdd();
    coverRef.current?.measureInWindow(startFlight);
  };

  const flightStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return { coverRef, flightStyle, addWithFlight };
}
