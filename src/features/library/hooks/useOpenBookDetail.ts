import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export default function useOpenBookDetail() {
  const router = useRouter();

  const openBookDetail = useCallback(
    (isbn: string) => {
      console.log('ouverture du détail', isbn);
      router.push(`/book/${isbn}`);
    },
    [router],
  );

  return { openBookDetail };
}
