import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { Button, StyleSheet, Text, View } from 'react-native';

import RuntimeInfo from '@/components/RuntimeInfo';
import LibraryListItem from '@/features/library/components/LibraryListItem';
import useLibraryScreen from '@/features/library/hooks/useLibraryScreen';
import type { LibraryRow } from '@/features/library/types/library.types';

function renderRow({ item }: ListRenderItemInfo<LibraryRow>) {
  return <LibraryListItem row={item} />;
}

export default function LibraryScreen() {
  const { rows, keyExtractor, getItemType, sortByTitle, sortByAuthor } = useLibraryScreen();
  console.log('render LibraryScreen', rows.length);

  return (
    <View style={styles.container}>
      <RuntimeInfo />
      <View style={styles.sortBar}>
        <Text>Trier par</Text>
        <Button title="Titre" onPress={sortByTitle} />
        <Button title="Auteur" onPress={sortByAuthor} />
      </View>
      <FlashList
        data={rows}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        renderItem={renderRow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sortBar: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8 },
});
