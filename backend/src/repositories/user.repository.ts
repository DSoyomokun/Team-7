import { supabase } from '../config/database';

interface UserData {
  user_id: string;
  email?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export class UserRepository {
  static async findById(userId: string): Promise<UserData> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(`User not found: ${error.message}`);
    return data;
  }

  static async create(userData: Partial<UserData>): Promise<UserData> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(userData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  }

  static async update(userId: string, updates: Partial<UserData>): Promise<UserData> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  }

  static async delete(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  }
}