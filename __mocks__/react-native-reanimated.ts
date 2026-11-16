import { View } from 'react-native';

const identity = <T>(value: T) => value;

export const css = {
  create: identity,
};

export const useSharedValue = <T>(initialValue: T) => ({ value: initialValue });

export const useAnimatedStyle = (updater: () => object) => updater();

export const withTiming = identity;
export const withSpring = identity;
export const withDelay = (_delayMs: number, animation: unknown) => animation;
export const withRepeat = identity;
export const withSequence = (...animations: unknown[]) => animations[animations.length - 1];

export default { View };
