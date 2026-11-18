import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function BookDetailLoading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <Text>Chargement…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
});
