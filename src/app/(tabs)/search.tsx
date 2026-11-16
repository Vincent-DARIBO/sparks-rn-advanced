import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { searchBooks } from '@/api/openLibrary';
import type { SearchResult } from '@/types/book';

type SearchDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
};

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(false);
    try {
      const res = await searchBooks(query.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: { docs: SearchDoc[] } = await res.json();
      setResults(
        json.docs.slice(0, 20).map((doc) => ({
          key: doc.key,
          title: doc.title ?? 'Sans titre',
          author: doc.author_name?.[0] ?? 'Auteur inconnu',
          isbn: doc.isbn?.find((i) => i.startsWith('978')) ?? doc.isbn?.[0],
        })),
      );
    } catch (e) {
      console.log('erreur recherche', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Titre du livre"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <Button title="Chercher" onPress={onSearch} />
      {loading ? <ActivityIndicator style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>Erreur lors de la recherche</Text> : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            disabled={!item.isbn}
            onPress={() => {
              console.log('ouverture du détail', item.isbn);
              router.push(`/book/${item.isbn}`);
            }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 16 },
  loader: { marginVertical: 8 },
  error: { color: '#c00' },
  row: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  title: { fontSize: 16, fontWeight: '600' },
  author: { color: '#666' },
});
