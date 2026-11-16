import { StyleSheet, View } from 'react-native';

import IsbnCamera from '@/components/IsbnCamera';
import ManualIsbnForm from '@/components/ManualIsbnForm';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <IsbnCamera />
      <ManualIsbnForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
