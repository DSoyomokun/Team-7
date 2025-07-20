require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    console.error('Please add:');
    console.error('SUPABASE_URL=https://immywbjpwmdmbcuknpwb.supabase.co');
    console.error('SUPABASE_KEY=sb_publishable_jGWo6hNjfBvJEd4ELkfSDQ_5E2xrr3Z');
    throw new Error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
    try {
        console.log('Testing database connection...');
        console.log(`Connecting to: ${supabaseUrl}`);
        
        // Try to access a simple table or use a basic query
        const { data, error } = await supabase
            .from('profiles') // Try profiles table first
            .select('*')
            .limit(1);

        if (error) {
            // If profiles table doesn't exist, try transactions
            const { data: transData, error: transError } = await supabase
                .from('transactions')
                .select('*')
                .limit(1);
                
            if (transError) {
                console.warn('Could not connect to profiles or transactions table');
                console.warn('This might be normal if tables don\'t exist yet');
                console.log('Supabase client created successfully');
                return;
            }
        }

        console.log('Database connected successfully');
        console.log(`Connected to Supabase project: ${supabaseUrl.replace('https://', '').split('.')[0]}`);
    } catch (error) {
        console.error('Database connection failed');
        console.error('Error:', error.message);
        console.log('Continuing without database connection test...');
    }
};

if (process.env.NODE_ENV === 'development') {
    testConnection();
}

module.exports = {
    supabase,
    query: async (table, operation, params = {}) => {  
        const operations = {
            insert: () => {
                if (!params.data) throw new Error('Missing data for insert');
                return supabase.from(table).insert(params.data);
            },
            select: () => supabase.from(table).select(params.columns || '*'),
            update: () => {
                if (!params.data || !params.where || params.equals === undefined) throw new Error('Missing parameters for update');
                return supabase.from(table).update(params.data).eq(params.where, params.equals);
            },
            delete: () => {
                if (!params.where || params.equals === undefined) throw new Error('Missing parameters for delete');
                return supabase.from(table).delete().eq(params.where, params.equals);
            }
        };
        if (!operations[operation]) {
            throw new Error(`Invalid operation: ${operation}`);
        }
        const { data, error } = await operations[operation]();
        if (error) {
            console.error(`Database ${operation} error:`, error);
            throw new Error(`DB_${operation.toUpperCase()}_ERROR`);
        }
        return data;
    }
};

