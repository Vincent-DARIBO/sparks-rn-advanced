import { StyleSheet, Text, View } from 'react-native';

import useRuntimeInfo from '@/hooks/useRuntimeInfo';

export default function RuntimeInfo() {
  const { isHermesEnabled, hermesVersion, isFabricEnabled } = useRuntimeInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.line}>Hermes : {String(isHermesEnabled)}</Text>
      <Text style={styles.line}>Version : {hermesVersion}</Text>
      <Text style={styles.line}>Fabric : {String(isFabricEnabled)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f2f2f7',
  },
  line: {
    fontSize: 12,
    fontFamily: 'Menlo',
  },
});
