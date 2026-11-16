import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { coverUrl } from '@/lib/coverUrl';

type Props = {
  isbn: string;
};

function BookCover({ isbn }: Props) {
  return (
    <Image
      source={{ uri: coverUrl(isbn, 'M') }}
      recyclingKey={isbn}
      cachePolicy="memory-disk"
      transition={150}
      style={styles.cover}
    />
  );
}

const styles = StyleSheet.create({
  cover: { width: 48, height: 72, marginRight: 12, backgroundColor: '#eee' },
});

export default memo(BookCover);
