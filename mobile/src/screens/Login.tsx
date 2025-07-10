import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) Alert.alert('Login Error', error.message);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) Alert.alert('Sign Up Error', error.message);
    else Alert.alert('Success', 'Check your inbox for confirmation.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In or Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPw}
        value={pw}
      />
      <Button title="Login" onPress={login} />
      <View style={{ height: 10 }} />
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12 },
});