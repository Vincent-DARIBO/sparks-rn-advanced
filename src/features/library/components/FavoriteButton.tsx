import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import useFavorite from '@/features/library/hooks/useFavorite';

type Props = {
  isbn: string;
};

function FavoriteButton({ isbn }: Props) {
  const { isFavorite, toggleFavorite } = useFavorite(isbn);

  return (
    <Pressable onPress={toggleFavorite} style={styles.button}>
      <Text style={styles.icon}>{isFavorite ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});

export default memo(FavoriteButton);
