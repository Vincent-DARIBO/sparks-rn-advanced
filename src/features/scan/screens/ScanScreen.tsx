import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import IsbnCamera from '@/features/scan/components/IsbnCamera';
import ManualIsbnForm from '@/features/scan/components/ManualIsbnForm';
import useScanLayout from '@/features/scan/hooks/useScanLayout';

export default function ScanScreen() {
  const { headerHeight, isKeyboardVisible } = useScanLayout();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <View style={isKeyboardVisible ? styles.cameraCollapsed : null}>
        <IsbnCamera />
      </View>
      <ManualIsbnForm />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cameraCollapsed: { height: 0, overflow: 'hidden' },
});
