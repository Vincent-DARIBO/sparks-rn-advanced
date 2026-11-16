import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { memo, useState } from 'react';

import { coverUrl } from '@/lib/coverUrl';
import type { Book } from '@/types/book.types';

type Props = {
  book: Book;
  onPress: (isbn: string) => void;
};

function BookRow({ book, onPress }: Props) {
  const [favorite, setFavorite] = useState(false);
  console.log('render BookRow', book.isbn);

  return (
    <Pressable onPress={() => onPress(book.isbn)} style={styles.row}>
      <Image source={{ uri: coverUrl(book.isbn, 'L') }} style={styles.cover} />
      <View style={styles.texts}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
      </View>
      <Pressable onPress={() => setFavorite(!favorite)} style={styles.favoriteButton}>
        <Text style={styles.favoriteIcon}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cover: { width: 48, height: 72, marginRight: 12, backgroundColor: '#eee' },
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  author: { color: '#666' },
  favoriteButton: { padding: 8 },
  favoriteIcon: { fontSize: 24 },
});

export default memo(BookRow);
