import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000ff', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText type="title" style={styles.heading}>
            Welcome to <Text style={styles.highlight}>Team 7's</Text> FinTrack App
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Simplify your money. Master your goals.
          </ThemedText>
        </ThemedView>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.authButtons}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.loginButton]}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Your Smart Finance Companion</ThemedText>
        <ThemedText>
          FinTrack is a full-stack budgeting app designed to help users manage their finances with ease.
          It connects your bank accounts, digital wallets, and even your crypto portfolios into one intuitive platform.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Key Features</ThemedText>
        <ThemedText>
          • Automatic & manual transaction tracking{'\n'}
          • Smart categorization (rent, groceries, etc.){'\n'}
          • Real-time cash flow insights by day, week, or month{'\n'}
          • Goal tracking for savings or debt payoff{'\n'}
          • Notifications for bills, low balance, and progress
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Who We Built It For</ThemedText>
        <ThemedText>
          From young adults building financial habits to professionals managing investments, FinTrack supports anyone looking to make informed money decisions.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">What Powers Our App</ThemedText>
        <ThemedText>
          • Supabase (PostgreSQL) for secure data storage and auth{'\n'}
          • React Native for a modern, cross-platform UI{'\n'}
          • Node.js & Express for backend API and data processing{'\n'}
          • Plaid API for safe bank account integration
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004225',
  },
  highlight: {
    color: '#007F5F',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  reactLogo: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007F5F',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: '#004225',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
