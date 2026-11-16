import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';

import { coverUrl, fetchBookByIsbn } from '@/api/openLibrary';
import { addBook } from '@/store/library';
import type { BookDetails } from '@/types/book';

type Status = 'loading' | 'notFound' | 'error' | 'success';

type OpenLibraryBook = {
  title?: string;
  number_of_pages?: number;
  by_statement?: string;
};

export default function BookDetailScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [book, setBook] = useState<BookDetails | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBookByIsbn(isbn)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setStatus('notFound');
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: OpenLibraryBook = await res.json();
        if (cancelled) return;
        setBook({
          title: json.title ?? 'Sans titre',
          numberOfPages: json.number_of_pages,
          byStatement: json.by_statement,
        });
        setStatus('success');
      })
      .catch((e) => {
        console.log('erreur détail', e);
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [isbn, attempt]);

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement…</Text>
      </View>
    );
  }

  if (status === 'notFound') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Livre introuvable</Text>
      </View>
    );
  }

  if (status === 'error' || !book) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Une erreur est survenue</Text>
        <Button title="Réessayer" onPress={() => {
            setStatus('loading');
            setAttempt((n) => n + 1);
          }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: book.title }} />
      <Image source={{ uri: coverUrl(isbn, 'L') }} style={styles.cover} resizeMode="contain" />
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.numberOfPages ? `${book.numberOfPages} pages` : 'Nombre de pages inconnu'}</Text>
      <Button
        title={added ? 'Ajouté à la bibliothèque' : 'Ajouter à ma bibliothèque'}
        disabled={added}
        onPress={() => {
          addBook({ isbn, title: book.title, author: book.byStatement ?? 'Auteur inconnu' });
          setAdded(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, alignItems: 'center', backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#fff' },
  cover: { width: 200, height: 300 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
});
