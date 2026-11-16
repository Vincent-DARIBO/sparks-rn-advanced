import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

import RuntimeInfo from '@/components/RuntimeInfo';
import BookRow from '@/features/library/components/BookRow';
import useLibrary from '@/features/library/hooks/useLibrary';
import type { Book } from '@/types/book.types';

export default function LibraryScreen() {
  const router = useRouter();
  const { addedBooks, seedBooks, sortKey, setSortKey } = useLibrary();

  const handlePress = useCallback(
    (isbn: string) => {
      console.log('ouverture du détail', isbn);
      router.push(`/book/${isbn}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Book }) => <BookRow book={item} onPress={handlePress} />,
    [handlePress],
  );

  const sorted = [...seedBooks].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  const books = [...addedBooks, ...sorted];
  console.log('render LibraryScreen', books.length);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <RuntimeInfo />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 }}>
        <Text>Trier par</Text>
        <Button title="Titre" onPress={() => setSortKey('title')} />
        <Button title="Auteur" onPress={() => setSortKey('author')} />
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.isbn}
        renderItem={renderItem}
      />
    </View>
  );
}
