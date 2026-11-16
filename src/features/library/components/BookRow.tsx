import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import BookCover from '@/features/library/components/BookCover';
import BookRowTexts from '@/features/library/components/BookRowTexts';
import FavoriteButton from '@/features/library/components/FavoriteButton';

type Props = {
  isbn: string;
  title: string;
  author: string;
  onPress: (isbn: string) => void;
};

function BookRow({ isbn, title, author, onPress }: Props) {
  console.log('render BookRow', isbn);

  return (
    <Pressable onPress={() => onPress(isbn)} style={styles.row}>
      <BookCover isbn={isbn} />
      <BookRowTexts title={title} author={author} />
      <FavoriteButton isbn={isbn} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default memo(BookRow);
