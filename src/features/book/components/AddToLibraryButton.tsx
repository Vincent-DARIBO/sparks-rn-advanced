import { Pressable, Text } from 'react-native';
import Animated, { css } from 'react-native-reanimated';

type AddToLibraryButtonProps = {
  isAdded: boolean;
  isWaitingForNetwork: boolean;
  onPress: () => void;
};

export default function AddToLibraryButton(props: AddToLibraryButtonProps) {
  const { isAdded, isWaitingForNetwork, onPress } = props;

  return (
    <Animated.View
      style={[
        styles.button,
        isAdded ? styles.added : null,
        isWaitingForNetwork ? styles.waiting : null,
      ]}>
      <Pressable
        accessibilityRole="button"
        disabled={isAdded || isWaitingForNetwork}
        onPress={onPress}
        style={styles.pressable}>
        <Text style={styles.label}>
          {isAdded ? 'Ajouté à la bibliothèque' : 'Ajouter à ma bibliothèque'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = css.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#007aff',
    opacity: 1,
    transitionProperty: ['backgroundColor', 'opacity'],
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease-in-out',
  },
  added: { backgroundColor: '#34c759' },
  waiting: { opacity: 0.5 },
  pressable: { paddingVertical: 10, paddingHorizontal: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
