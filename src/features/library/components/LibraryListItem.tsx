import { memo } from 'react';

import BookRow from '@/features/library/components/BookRow';
import useOpenBookDetail from '@/features/library/hooks/useOpenBookDetail';
import type { Book } from '@/types/book.types';

type Props = {
  book: Book;
};

function LibraryListItem({ book }: Props) {
  const { openBookDetail } = useOpenBookDetail();

  return (
    <BookRow isbn={book.isbn} title={book.title} author={book.author} onPress={openBookDetail} />
  );
}

export default memo(LibraryListItem);
