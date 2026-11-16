import { Stack, useLocalSearchParams } from 'expo-router';

import BookDetailContent from '@/features/book/components/BookDetailContent';
import BookDetailLoading from '@/features/book/components/BookDetailLoading';
import BookDetailMessage from '@/features/book/components/BookDetailMessage';
import useBookDetail from '@/features/book/hooks/useBookDetail';

export default function BookDetailScreen() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { book, status, isAdded, addToLibrary, retry } = useBookDetail(isbn);

  if (status === 'loading') return <BookDetailLoading />;
  if (status === 'notFound') return <BookDetailMessage title="Livre introuvable" />;
  if (status === 'error' || !book) {
    return <BookDetailMessage title="Une erreur est survenue" onRetry={retry} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: book.title }} />
      <BookDetailContent book={book} isAdded={isAdded} onAdd={addToLibrary} />
    </>
  );
}
