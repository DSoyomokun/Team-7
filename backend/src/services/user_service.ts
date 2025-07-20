import { supabase } from '../config/database';
import UserRepository from '../repositories/user.repository';

// Example type for a profile, adjust fields as necessary
interface Profile {
  id?: string;
  user_id: string;
  full_name?: string;
  email?: string;
  [key: string]: any;
}

class UserService {
  static async getProfile(userId: string): Promise<Profile | null> {
    return await UserRepository.findById(userId);
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select();

    if (error) throw new Error(error.message);
    return data as Profile[];
  }

  static async deleteAccount(userId: string): Promise<void> {
    await supabase.from('profiles').delete().eq('user_id', userId);

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
  }
}

export default UserService;
