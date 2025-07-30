import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../src/context/AuthProvider';

export default function TabsLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return <Slot />;
}
