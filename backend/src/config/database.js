require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Correct way to access environment variables (no dots after process.env)
const supabaseUrl = process.env.SUPABASE_URL; // Should be "https://immywbjpwmdmbcuknpwb.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY; // Should be "eyJhbGci...."

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .limit(1);

        if (error) throw error;

        console.log('Database connected');
        console.log(`Connected to Supabase project: ${supabaseUrl.replace('https://', '').split('.')[0]}`);
    } catch (error) {
        console.error('Database connection failed');
        console.error(error.message);
        process.exit(1);
    }
};

testConnection();

module.exports = {
    supabase,
    query: async (table, operation, params = {}) => {  // Fixed parameter name (was WebTransportBidirectionalStream)
        const operations = {
            insert: () => supabase.from(table).insert(params.data),
            select: () => supabase.from(table).select(params.columns || '*'),
            update: () => supabase.from(table).update(params.data).eq(params.where, params.equals),
            delete: () => supabase.from(table).delete().eq(params.where, params.equals)
        };
        
        const { data, error } = await operations[operation]();
        
        if (error) {
            console.error(`Database ${operation} error:`, error);
            throw new Error(`DB_${operation.toUpperCase()}_ERROR`);
        }

        return data;
    }
};

