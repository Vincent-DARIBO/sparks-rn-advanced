import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import SearchResultRow from '@/features/search/components/SearchResultRow';
import useSearchScreen from '@/features/search/hooks/useSearchScreen';

export default function SearchScreen() {
  const {
    queryInput,
    setQueryInput,
    submitSearch,
    searchResults,
    isLoadingSearch,
    isFetchingMoreSearchResults,
    hasSearchError,
    loadMoreResults,
    openResult,
  } = useSearchScreen();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Titre du livre"
        value={queryInput}
        onChangeText={setQueryInput}
        onSubmitEditing={submitSearch}
        returnKeyType="search"
      />
      <Button title="Chercher" onPress={submitSearch} />
      {isLoadingSearch ? <ActivityIndicator style={styles.loader} /> : null}
      {hasSearchError ? <Text style={styles.error}>Erreur lors de la recherche</Text> : null}
      <FlatList
        data={searchResults}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        renderItem={({ item }) => <SearchResultRow result={item} onPress={openResult} />}
        onEndReached={loadMoreResults}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMoreSearchResults ? <ActivityIndicator style={styles.loader} /> : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 16 },
  loader: { marginVertical: 8 },
  error: { color: '#c00' },
});
