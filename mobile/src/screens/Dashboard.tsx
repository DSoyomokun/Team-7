import { View, Text, Button } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>🚀 Team-7 Budget Dashboard</Text>

      {/* Replace the block below with charts, balances, etc. */}
      <Text>Your summary cards and charts will go here.</Text>

      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
