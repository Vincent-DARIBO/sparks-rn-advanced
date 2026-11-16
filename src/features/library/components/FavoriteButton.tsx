import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function FavoriteButton() {
  const [favorite, setFavorite] = useState(false);

  return (
    <Pressable onPress={() => setFavorite(!favorite)} style={styles.button}>
      <Text style={styles.icon}>{favorite ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
