import { createClient } from '@supabase/supabase-js';

// Use Expo public env vars if available, otherwise use placeholders
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
  realtime: { params: { eventsPerSecond: 10 } },
}); 