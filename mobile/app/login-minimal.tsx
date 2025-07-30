import { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text, 
  Pressable,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';

export default function LoginMinimal() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    console.log('🔐 Login attempt started');
    console.log('Email:', email);
    console.log('Password length:', pw.length);
    
    if (!email || !pw) {
      console.log('❌ Missing credentials');
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    console.log('📡 Calling Supabase auth...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: pw 
      });
      
      console.log('📨 Supabase response:', { data: !!data, error: error?.message });
      
      if (error) {
        console.error('❌ Login error:', error);
        Alert.alert('Login Error', error.message);
      } else {
        console.log('✅ Login successful, navigating to dashboard');
        router.replace('/dashboard');
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err);
      Alert.alert('Error', `Unexpected error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    console.log('📝 Signup attempt started');
    
    if (!email || !pw) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    if (pw.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    console.log('📡 Calling Supabase signup...');
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: pw 
      });
      
      console.log('📨 Signup response:', { data: !!data, error: error?.message });
      
      if (error) {
        console.error('❌ Signup error:', error);
        Alert.alert('Sign Up Error', error.message);
      } else {
        console.log('✅ Signup successful');
        Alert.alert('Success', 'Account created! Please check your email to verify your account, then you can log in.');
        setEmail('');
        setPw('');
      }
    } catch (err: any) {
      console.error('💥 Unexpected signup error:', err);
      Alert.alert('Error', `Unexpected error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>FinTrack Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          editable={!isLoading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPw}
          value={pw}
          editable={!isLoading}
        />

        <Pressable
          style={styles.button}
          onPress={login}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={signUp}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#1a0d2e',
  },
  form: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 27, 61, 0.8)',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center',
    color: 'white',
  },
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15,
    fontSize: 16,
    color: 'white',
  },
  button: {
    backgroundColor: '#7c5fa0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7c5fa0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c5fa0',
  },
});