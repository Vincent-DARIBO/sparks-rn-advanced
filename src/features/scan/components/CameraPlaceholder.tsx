import { StyleSheet, Text, View } from 'react-native';

type CameraPlaceholderProps = {
  message: string;
};

export default function CameraPlaceholder(props: CameraPlaceholderProps) {
  const { message } = props;

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 120,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f2f2f7',
  },
  placeholderText: { textAlign: 'center', color: '#444' },
});
