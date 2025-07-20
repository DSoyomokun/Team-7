import { supabase } from './src/config/database';

// Type for the sample user
interface SampleUser {
  email: string;
  password: string;
  full_name: string;
  avatar_url: string | null;
}

const sampleUsers: SampleUser[] = [
  {
    email: 'john@team7.com',
    password: 'password123',
    full_name: 'John Doe',
    avatar_url: null
  },
  {
    email: 'jane@team7.com',
    password: 'password123',
    full_name: 'Jane Smith',
    avatar_url: null
  },
  {
    email: 'admin@team7.com',
    password: 'admin123',
    full_name: 'Admin User',
    avatar_url: null
  }
];

async function createUsers(): Promise<void> {
  console.log('👥 Creating sample users in Supabase...\n');

  for (const user of sampleUsers) {
    try {
      console.log(`📝 Creating user: ${user.email}`);

      // Supabase Admin API typically returns data types—update the types here for your library version if you want!
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true // Auto-confirm email
      });

      if (authError) {
        console.log(`  ❌ Auth creation failed: ${authError.message}`);
        continue;
      }

      // If authData.user may be undefined, you can include a check here.
      const userId = authData.user.id;

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.log(`  ❌ Profile creation failed: ${profileError.message}`);
      } else {
        console.log(`  ✅ User created successfully: ${user.email}`);
        console.log(`     User ID: ${userId}`);
        console.log(`     Password: ${user.password}`);
      }

    } catch (error: any) {
      console.log(`  ❌ Error creating user ${user.email}: ${error.message}`);
    }

    console.log(''); // Empty line
  }

  console.log('🏁 User creation completed!');
  console.log('\n📋 You can now test login with these credentials:');
  sampleUsers.forEach(user => {
    console.log(`   Email: ${user.email}, Password: ${user.password}`);
  });
}

createUsers().catch(console.error);
