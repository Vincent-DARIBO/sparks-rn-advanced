import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
};

function SectionHeader({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f2f2f2' },
  label: { fontSize: 14, fontWeight: '700', color: '#444' },
});

export default memo(SectionHeader);
