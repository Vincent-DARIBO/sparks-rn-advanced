import { Button, Image, StyleSheet, Text, View } from 'react-native';

import { coverUrl } from '@/lib/coverUrl';
import type { Book } from '@/types/book.types';

type BookDetailContentProps = {
  book: Book;
  isAdded: boolean;
  onAdd: () => void;
};

export default function BookDetailContent(props: BookDetailContentProps) {
  const { book, isAdded, onAdd } = props;

  return (
    <View style={styles.container}>
      <Image source={{ uri: coverUrl(book.isbn, 'L') }} style={styles.cover} resizeMode="contain" />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.numberOfPages ? `${book.numberOfPages} pages` : 'Nombre de pages inconnu'}</Text>
      <Button
        title={isAdded ? 'Ajouté à la bibliothèque' : 'Ajouter à ma bibliothèque'}
        disabled={isAdded}
        onPress={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, alignItems: 'center', backgroundColor: '#fff' },
  cover: { width: 200, height: 300 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
});
