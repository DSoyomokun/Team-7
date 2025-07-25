const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🔧 Setting up database tables...\n');

  try {
    // Check if tables exist
    console.log('1️⃣ Checking existing tables...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('ℹ️ Could not check existing tables:', tablesError.message);
    } else {
      console.log('📋 Existing tables:', tables.map(t => t.table_name));
    }
    console.log('');

    // Try to create profile table if it doesn't exist
    console.log('2️⃣ Creating profile table...');
    const { error: profileError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS profile(
          user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
          full_name TEXT,
          currency_preference TEXT DEFAULT 'USD',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (profileError) {
      console.log('ℹ️ Profile table creation:', profileError.message);
    } else {
      console.log('✅ Profile table ready');
    }

    // Try to create transactions table if it doesn't exist
    console.log('3️⃣ Creating transactions table...');
    const { error: transactionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS transactions(
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users NOT NULL,
          amount NUMERIC(12, 2) NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
          category TEXT,
          description TEXT,
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (transactionsError) {
      console.log('ℹ️ Transactions table creation:', transactionsError.message);
    } else {
      console.log('✅ Transactions table ready');
    }

    // Try to create categories table if it doesn't exist
    console.log('4️⃣ Creating categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories(
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users NOT NULL,
          name TEXT NOT NULL,
          color TEXT,
          icon TEXT,
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (categoriesError) {
      console.log('ℹ️ Categories table creation:', categoriesError.message);
    } else {
      console.log('✅ Categories table ready');
    }

    console.log('');
    console.log('🎉 Database setup completed!');
    console.log('');
    console.log('📝 Note: You may need to create tables manually in Supabase dashboard');
    console.log('   if the RPC method is not available.');
    console.log('');
    console.log('🔗 Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
    console.log('   and run the schema.sql file manually.');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('');
    console.log('💡 Manual Setup Required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the contents of src/config/schema.sql');
  }
}

setupDatabase(); 