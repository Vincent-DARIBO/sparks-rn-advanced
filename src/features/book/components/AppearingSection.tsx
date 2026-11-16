import type { PropsWithChildren } from 'react';
import Animated, { css } from 'react-native-reanimated';

export default function AppearingSection(props: PropsWithChildren) {
  const { children } = props;

  return <Animated.View style={styles.section}>{children}</Animated.View>;
}

const styles = css.create({
  section: {
    gap: 12,
    alignItems: 'center',
    animationName: {
      from: { opacity: 0, transform: [{ translateY: 16 }] },
      to: { opacity: 1, transform: [{ translateY: 0 }] },
    },
    animationDuration: '400ms',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
  },
});
