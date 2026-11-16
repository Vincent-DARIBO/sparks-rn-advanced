import { Image, Pressable, Text, View } from 'react-native';
import { memo, useState } from 'react';

import { coverUrl } from '@/lib/coverUrl';
import type { Book } from '@/types/book.types';

type Props = {
  book: Book;
  onPress: (isbn: string) => void;
};

function BookRow({ book, onPress }: Props) {
  const [favorite, setFavorite] = useState(false);
  console.log('render BookRow', book.isbn);

  return (
    <Pressable
      onPress={() => onPress(book.isbn)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      }}
    >
      <Image
        source={{ uri: coverUrl(book.isbn, 'L') }}
        style={{ width: 48, height: 72, marginRight: 12, backgroundColor: '#eee' }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{book.title}</Text>
        <Text style={{ color: '#666' }}>{book.author}</Text>
      </View>
      <Pressable onPress={() => setFavorite(!favorite)} style={{ padding: 8 }}>
        <Text style={{ fontSize: 24 }}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
    </Pressable>
  );
}

export default memo(BookRow);
