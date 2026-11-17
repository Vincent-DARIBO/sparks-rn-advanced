import { Stack } from 'expo-router';

import AppProviders from '@/components/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[isbn]" options={{ title: 'Détail du livre' }} />
      </Stack>
    </AppProviders>
  );
}
