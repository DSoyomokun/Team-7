import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../src/lib/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

const signup = async () => {
  try {
    console.log('🧾 Fake signup with:', { email, pw, name });

    // Simulate token or user creation if needed
    // await AsyncStorage.setItem('access_token', 'fake-token'); // Optional

    // ✅ Redirect to dashboard
    router.replace('/dashboard');
  } catch (error) {
    Alert.alert('Signup Failed', error.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={styles.brand}>Fin</Text>Track</Text>
      <Text style={styles.subtitle}>Create a new account to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#ccc"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        onChangeText={setPw}
        value={pw}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={signup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: 8 },
  brand: { color: '#00f0ff', textShadowColor: '#00f0ffaa', textShadowRadius: 10 },
  subtitle: { textAlign: 'center', color: '#aaa', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 14, marginBottom: 16, color: '#fff', backgroundColor: '#1c1c1e' },
  button: { backgroundColor: '#1f1f1f', paddingVertical: 14, borderRadius: 8, marginTop: 6, alignItems: 'center', borderWidth: 1, borderColor: '#00f0ff', shadowColor: '#00f0ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});
