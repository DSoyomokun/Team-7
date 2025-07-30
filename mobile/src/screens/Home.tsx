import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/api';

export default function Home() {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 Welcome to the Home Page!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
});
