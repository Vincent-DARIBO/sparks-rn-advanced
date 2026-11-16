import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  author: string;
};

function BookRowTexts({ title, author }: Props) {
  return (
    <View style={styles.texts}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  author: { color: '#666' },
});

export default memo(BookRowTexts);
