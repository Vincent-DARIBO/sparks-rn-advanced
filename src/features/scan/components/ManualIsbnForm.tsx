import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import useManualIsbnEntry from '@/features/scan/hooks/useManualIsbnEntry';

export default function ManualIsbnForm() {
  const { isbnInput, setIsbnInput, inputError, isSubmitting, submitIsbn } = useManualIsbnEntry();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Saisir un ISBN"
        value={isbnInput}
        onChangeText={setIsbnInput}
        autoCapitalize="characters"
        autoCorrect={false}
        keyboardType="default"
      />
      {inputError ? <Text style={styles.error}>{inputError}</Text> : null}
      <Button title="Rechercher" onPress={submitIsbn} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#c00' },
});
