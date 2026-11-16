import type { ComponentRef, Ref } from 'react';
import { Image, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

type FlyingCoverProps = {
  uri: string;
  coverRef: Ref<ComponentRef<typeof Animated.View>>;
  flightStyle: AnimatedStyle<ViewStyle>;
};

export default function FlyingCover(props: FlyingCoverProps) {
  const { uri, coverRef, flightStyle } = props;

  return (
    <Animated.View ref={coverRef} style={[styles.wrapper, flightStyle]}>
      <Image source={{ uri }} style={styles.cover} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { zIndex: 10 },
  cover: { width: 200, height: 300 },
});
