import { supabase } from '../config/database';
import { hashPassword, comparePasswords } from '../utils/auth';

// You can create more precise types for Supabase responses if you wish.
// For now, we use basic types for simplicity.

export default class AuthService {
  /**
   * Sign up a new user.
   */
  static async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Login a user.
   */
  static async login(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Logout current user/session
   */
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<any> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  }
}
