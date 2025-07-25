import { SupabaseClient } from '@supabase/supabase-js';
export declare const supabase: SupabaseClient;
type QueryOperation = 'insert' | 'select' | 'update' | 'delete';
interface QueryParams {
    data?: any;
    columns?: string;
    where?: string;
    equals?: any;
}
export declare function query(table: string, operation: QueryOperation, params?: QueryParams): Promise<any>;
export {};
