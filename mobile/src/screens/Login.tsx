import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text, 
  Pressable,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { GlassTheme, glassStyles } from '../../constants/GlassTheme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    console.log('🚀 LOGIN BUTTON CLICKED!');
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', pw.length);
    
    if (!email || !pw) {
      console.log('❌ Missing email or password');
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    console.log('🔐 Attempting login with:', { email, password: pw.length + ' chars' });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: pw 
      });
      
      if (error) {
        console.error('Login error:', error);
        Alert.alert('Login Error', error.message);
      } else {
        console.log('✅ Login successful:', data);
        Alert.alert('Success', 'Logged in successfully!');
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    console.log('🚀 SIGNUP BUTTON CLICKED!');
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', pw.length);
    
    if (!email || !pw) {
      console.log('❌ Missing email or password');
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    if (pw.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    console.log('📝 Attempting signup with:', { email, password: pw.length + ' chars' });
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: pw 
      });
      
      if (error) {
        console.error('Signup error:', error);
        Alert.alert('Sign Up Error', error.message);
      } else {
        console.log('✅ Signup successful:', data);
        Alert.alert('Success', 'Account created! You can now log in.');
        // Clear form after successful signup
        setEmail('');
        setPw('');
      }
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick test login for development
  const quickLogin = () => {
    console.log('🚀 QUICK LOGIN BUTTON CLICKED!');
    setEmail('test@example.com');
    setPw('password123');
    console.log('✅ Test credentials filled');
  };

  // Web-native button component as fallback
  const WebButton = ({ onPress, style, disabled, children, testID }: any) => {
    if (Platform.OS === 'web') {
      return (
        <div
          onClick={onPress}
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
          data-testid={testID}
        >
          {children}
        </div>
      );
    }
    return (
      <Pressable style={style} onPress={onPress} disabled={disabled}>
        {children}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Glass morphism background */}
      <View style={styles.backgroundGradient} />
      
      <View style={[styles.loginCard, glassStyles.card]}>
        <Text style={styles.title}>🌟 Financial Dashboard</Text>
        <Text style={styles.subtitle}>Sign in to access your account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={GlassTheme.colors.neutral[500]}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          editable={!isLoading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={GlassTheme.colors.neutral[500]}
          secureTextEntry
          onChangeText={setPw}
          value={pw}
          editable={!isLoading}
        />

        {/* Login Button */}
        <WebButton
          style={[
            styles.button,
            styles.primaryButton,
            isLoading && styles.buttonDisabled
          ]}
          onPress={() => {
            console.log('WebButton onPress fired!');
            login();
          }}
          disabled={isLoading}
          testID="login-button"
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Signing In...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </WebButton>

        {/* Sign Up Button */}
        <WebButton
          style={[
            styles.button,
            styles.secondaryButton,
            isLoading && styles.buttonDisabled
          ]}
          onPress={() => {
            console.log('Signup WebButton onPress fired!');
            signUp();
          }}
          disabled={isLoading}
          testID="signup-button"
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={GlassTheme.colors.primary[500]} size="small" />
              <Text style={[styles.buttonTextSecondary, { marginLeft: 8 }]}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={styles.buttonTextSecondary}>Sign Up</Text>
          )}
        </WebButton>

        {/* Quick test button for development */}
        {__DEV__ && (
          <WebButton
            style={[styles.button, styles.testButton]}
            onPress={() => {
              console.log('Test WebButton onPress fired!');
              quickLogin();
            }}
            testID="test-button"
          >
            <Text style={styles.testButtonText}>🚀 Fill Test Credentials</Text>
          </WebButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: GlassTheme.colors.primary[900],
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GlassTheme.colors.primary[800],
    opacity: 0.5,
  },
  loginCard: {
    padding: GlassTheme.spacing.xxl,
    borderRadius: GlassTheme.borderRadius.xl,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 8, 
    textAlign: 'center',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: GlassTheme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: GlassTheme.spacing.xxl,
    fontFamily: GlassTheme.typography.body,
  },
  input: { 
    backgroundColor: GlassTheme.colors.glass.light,
    borderWidth: 1, 
    borderColor: GlassTheme.colors.glass.light,
    borderRadius: GlassTheme.borderRadius.lg, 
    padding: GlassTheme.spacing.lg, 
    marginBottom: GlassTheme.spacing.md,
    fontSize: 16,
    color: 'white',
    fontFamily: GlassTheme.typography.body,
  },
  button: {
    paddingVertical: GlassTheme.spacing.lg,
    paddingHorizontal: GlassTheme.spacing.xl,
    borderRadius: GlassTheme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: GlassTheme.spacing.md,
    minHeight: 56,
    justifyContent: 'center',
    cursor: 'pointer', // Web cursor
    userSelect: 'none', // Prevent text selection
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: GlassTheme.colors.primary[500],
    ...GlassTheme.shadows.glass,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: GlassTheme.colors.primary[500],
  },
  testButton: {
    backgroundColor: GlassTheme.colors.neutral[700],
    marginTop: GlassTheme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: '600',
    color: GlassTheme.colors.primary[500],
    fontFamily: GlassTheme.typography.primary,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    fontFamily: GlassTheme.typography.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});