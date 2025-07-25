import dotenv from 'dotenv';
dotenv.config();

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseUrl: string = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseKey: string = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Use mock credentials for testing if real ones are missing
if ((!supabaseUrl || !supabaseKey) && process.env.NODE_ENV === 'test') {
    console.warn('Using mock Supabase credentials for testing');
    supabaseUrl = 'https://test.supabase.co';
    supabaseKey = 'test-key';
} else if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    console.error('Please add:');
    console.error('SUPABASE_URL=your_supabase_project_url');
    console.error('SUPABASE_KEY=your_supabase_anon_key');
    throw new Error('Missing Supabase credentials in .env file');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async (): Promise<void> => {
    try {
        console.log('Testing database connection...');
        console.log(`Connecting to: ${supabaseUrl}`);
        
        // Try to access a simple table or use a basic query
        let { data, error } = await supabase
            .from('profiles')
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
    } catch (error: any) {
        console.error('Database connection failed');
        console.error('Error:', error.message);
        console.log('Continuing without database connection test...');
    }
};

if (process.env.NODE_ENV === 'development') {
    // "void" to avoid unhandled promise warning in top-level await
    void testConnection();
}

type QueryOperation = 'insert' | 'select' | 'update' | 'delete';
interface QueryParams {
    data?: any;
    columns?: string;
    where?: string;
    equals?: any;
}

export async function query(
    table: string,
    operation: QueryOperation,
    params: QueryParams = {}
): Promise<any> {
    const operations: Record<QueryOperation, () => Promise<any>> = {
        insert: async () => {
            if (!params.data) throw new Error('Missing data for insert');
            const { data, error } = await supabase.from(table).insert(params.data);
            if (error) throw new Error(error.message);
            return data;
        },
        select: async () => {
            const { data, error } = await supabase.from(table).select(params.columns || '*');
            if (error) throw new Error(error.message);
            return data;
        },
        update: async () => {
            if (!params.data || !params.where || params.equals === undefined) throw new Error('Missing parameters for update');
            const { data, error } = await supabase.from(table).update(params.data).eq(params.where, params.equals);
            if (error) throw new Error(error.message);
            return data;
        },
        delete: async () => {
            if (!params.where || params.equals === undefined) throw new Error('Missing parameters for delete');
            const { data, error } = await supabase.from(table).delete().eq(params.where, params.equals);
            if (error) throw new Error(error.message);
            return data;
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
