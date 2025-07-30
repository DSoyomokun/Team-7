import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signIn } from '../src/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();

const login = async () => {
  console.log('🔁 Fake login:', email);
  try {
    // 🚫 Skipping real authentication
    // Simulate storing token if needed
    await AsyncStorage.setItem('access_token', 'fake-token');
    
    // ✅ Navigate to dashboard
    router.replace('/dashboard');
  } catch (error) {
    console.error('❌ Navigation error:', error.message);
    Alert.alert('Login Failed', error.message);
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={styles.brand}>Fin</Text>Track</Text>
      <Text style={styles.subtitle}>Enter your credentials to access your account</Text>

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

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text style={styles.link} onPress={() => router.push('/signup')}>Sign up</Text>
      </Text>

      <Text style={[styles.link, { marginTop: 6 }]} onPress={() => Alert.alert('Reset link not implemented.')}>
        Forgot your password?
      </Text>
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
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  footerText: { marginTop: 16, textAlign: 'center', color: '#aaa' },
  link: { color: '#00f0ff', textDecorationLine: 'underline' },
});
