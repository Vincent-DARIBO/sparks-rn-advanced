import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { isValidIsbn, normalizeIsbn } from '@/utils/isbn';

export default function ScanScreen() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (!isValidIsbn(value)) {
      console.log('ISBN invalide', value);
      setError('ISBN invalide');
      return;
    }
    const isbn = normalizeIsbn(value);
    console.log('navigation vers le détail', isbn);
    setError(null);
    router.push(`/book/${isbn}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Saisir un ISBN"
        value={value}
        onChangeText={setValue}
        autoCapitalize="characters"
        autoCorrect={false}
        keyboardType="default"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Rechercher" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#c00' },
});
