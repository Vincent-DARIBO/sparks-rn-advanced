import { Button, StyleSheet, Text, View } from 'react-native';

type BookDetailMessageProps = {
  title: string;
  onRetry?: () => void;
};

export default function BookDetailMessage(props: BookDetailMessageProps) {
  const { title, onRetry } = props;

  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      {onRetry ? <Button title="Réessayer" onPress={onRetry} /> : null}
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
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
});
