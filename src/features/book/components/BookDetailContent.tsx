import { Button, StyleSheet, Text, View } from 'react-native';

import AppearingSection from '@/features/book/components/AppearingSection';
import FlyingCover from '@/features/book/components/FlyingCover';
import useAddedBookFlight from '@/features/book/hooks/useAddedBookFlight';
import { coverUrl } from '@/lib/coverUrl';
import type { Book } from '@/types/book.types';

type BookDetailContentProps = {
  book: Book;
  isAdded: boolean;
  isWaitingForNetwork: boolean;
  onAdd: () => void;
};

export default function BookDetailContent(props: BookDetailContentProps) {
  const { book, isAdded, isWaitingForNetwork, onAdd } = props;
  const { coverRef, flightStyle, addWithFlight } = useAddedBookFlight(onAdd);

  return (
    <View style={styles.container}>
      <FlyingCover uri={coverUrl(book.isbn, 'L')} coverRef={coverRef} flightStyle={flightStyle} />
      <AppearingSection>
        <Text style={styles.title}>{book.title}</Text>
        <Text>{book.numberOfPages ? `${book.numberOfPages} pages` : 'Nombre de pages inconnu'}</Text>
        <Button
          title={isAdded ? 'Ajouté à la bibliothèque' : 'Ajouter à ma bibliothèque'}
          disabled={isAdded || isWaitingForNetwork}
          onPress={addWithFlight}
        />
        {isWaitingForNetwork ? <Text style={styles.pending}>En attente de connexion</Text> : null}
      </AppearingSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  pending: { fontSize: 12, color: '#666' },
});
