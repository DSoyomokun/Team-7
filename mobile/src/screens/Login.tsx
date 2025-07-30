// src/screens/Login.tsx
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signUp, signIn } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();

const handleLogin = async () => {
  console.log('🔁 Logging in with:', email);
  try {
    const response = await signIn(email, pw);
    console.log('✅ Login Success:', response.data);

    const token = response.data.data.access_token;
    await AsyncStorage.setItem('token', token);
    setSession(token); // from context
    router.replace('/');
  } catch (err: any) {
    console.error('❌ Login failed:', err.response?.data?.error || err.message);
    Alert.alert('Login failed', err.response?.data?.error || 'Unknown error');
  }
};



  

  const handleSignup = async () => {
    try {
      const res = await signUp(email, pw, 'New User');
      console.log('✅ Signup success:', res.data);
      Alert.alert('Signup Success');
    } catch (err: any) {
      console.error('❌ Signup failed:', err.response?.data || err.message);
      Alert.alert('Signup Failed', err.response?.data?.error || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to <Text style={styles.highlight}>FinTrack</Text></Text>
      <Text style={styles.subtitle}>Please sign in or sign up</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#555' }]} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  highlight: {
    color: '#4ade80'
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: '#fff'
  },
  button: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
