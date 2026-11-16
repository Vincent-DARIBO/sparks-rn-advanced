import { Button, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import useJsThreadDemo from '@/features/book/hooks/useJsThreadDemo';
import useWorkletPulse from '@/features/book/hooks/useWorkletPulse';

export default function JsThreadDemo() {
  const { jsTicks, blockJsThread } = useJsThreadDemo();
  const { pulseStyle } = useWorkletPulse();

  return (
    <View style={styles.container}>
      <View style={styles.indicators}>
        <View style={styles.indicator}>
          <Animated.View style={[styles.dot, pulseStyle]} />
          <Text style={styles.caption}>Animation thread UI</Text>
        </View>
        <View style={styles.indicator}>
          <Text style={styles.counter}>{jsTicks}</Text>
          <Text style={styles.caption}>Compteur thread JS</Text>
        </View>
      </View>
      <Button title="Bloquer le thread JS 2 s" onPress={blockJsThread} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, alignItems: 'center' },
  indicators: { flexDirection: 'row', gap: 32, alignItems: 'center' },
  indicator: { alignItems: 'center', gap: 6, minWidth: 120 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#0a7' },
  counter: { fontSize: 16, fontVariant: ['tabular-nums'] },
  caption: { fontSize: 11, color: '#666' },
});
