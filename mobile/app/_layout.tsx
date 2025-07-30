import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
