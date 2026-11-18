import { Pressable, StyleSheet, Text } from 'react-native';

import type { SearchResult } from '@/types/book.types';

type SearchResultRowProps = {
  result: SearchResult;
  onPress: (result: SearchResult) => void;
};

export default function SearchResultRow(props: SearchResultRowProps) {
  const { result, onPress } = props;

  return (
    <Pressable style={styles.row} disabled={!result.isbn} onPress={() => onPress(result)}>
      <Text style={styles.title}>{result.title}</Text>
      <Text style={styles.author}>{result.author}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  title: { fontSize: 16, fontWeight: '600' },
  author: { color: '#666' },
});
