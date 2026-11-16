import { memo } from 'react';

import BookRow from '@/features/library/components/BookRow';
import SectionHeader from '@/features/library/components/SectionHeader';
import useOpenBookDetail from '@/features/library/hooks/useOpenBookDetail';
import type { LibraryRow } from '@/features/library/types/library.types';

type Props = {
  row: LibraryRow;
};

function LibraryListItem({ row }: Props) {
  const { openBookDetail } = useOpenBookDetail();

  if (row.type === 'header') {
    return <SectionHeader label={row.label} />;
  }

  return (
    <BookRow
      isbn={row.book.isbn}
      title={row.book.title}
      author={row.book.author}
      onPress={openBookDetail}
    />
  );
}

export default memo(LibraryListItem);
