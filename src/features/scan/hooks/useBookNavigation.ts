import { useRouter } from 'expo-router';

import usePrefetchBook from '@/hooks/usePrefetchBook';

export default function useBookNavigation() {
  const router = useRouter();
  const { prefetchBook } = usePrefetchBook();

  const openBookDetail = async (isbn: string) => {
    await prefetchBook(isbn);
    router.push(`/book/${isbn}`);
  };

  return { openBookDetail };
}
