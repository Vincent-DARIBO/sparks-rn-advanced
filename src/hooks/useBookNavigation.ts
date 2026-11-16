import { useRouter } from 'expo-router';

export default function useBookNavigation() {
  const router = useRouter();

  const openBookDetail = (isbn: string) => {
    router.push(`/book/${isbn}`);
  };

  return { openBookDetail };
}
