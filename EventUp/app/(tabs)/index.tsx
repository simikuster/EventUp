import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
      <View style={styles.container}>
        <Text style={styles.text}>Hallo Welt</Text>
        <Text>Lernzapp läuft!</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});