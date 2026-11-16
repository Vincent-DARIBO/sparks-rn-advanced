import { FlashList } from '@shopify/flash-list';
import { Button, StyleSheet, Text, View } from 'react-native';

import RuntimeInfo from '@/components/RuntimeInfo';
import LibraryListItem from '@/features/library/components/LibraryListItem';
import useLibraryScreen from '@/features/library/hooks/useLibraryScreen';
import type { Book } from '@/types/book.types';

function renderBook({ item }: { item: Book }) {
  return <LibraryListItem book={item} />;
}

export default function LibraryScreen() {
  const { books, keyExtractor, sortByTitle, sortByAuthor } = useLibraryScreen();
  console.log('render LibraryScreen', books.length);

  return (
    <View style={styles.container}>
      <RuntimeInfo />
      <View style={styles.sortBar}>
        <Text>Trier par</Text>
        <Button title="Titre" onPress={sortByTitle} />
        <Button title="Auteur" onPress={sortByAuthor} />
      </View>
      <FlashList data={books} keyExtractor={keyExtractor} renderItem={renderBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sortBar: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 },
});
