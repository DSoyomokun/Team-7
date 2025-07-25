import { supabase } from '../config/database';
import { hashPassword, comparePasswords } from '../utils/auth';
import { UserRepository } from '../repositories/user.repository';

// You can create more precise types for Supabase responses if you wish.
// For now, we use basic types for simplicity.

export default class AuthService {
  /**
   * Sign up a new user.
   */
  static async signUp(email: string, password: string, name?: string): Promise<any> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) throw new Error(error.message);

    // Create profile record if user was successfully created
    if (data.user) {
      try {
        await UserRepository.create({
          user_id: data.user.id,
          full_name: name || undefined,
          currency_preference: 'USD'
        });
      } catch (profileError) {
        console.error('Failed to create user profile:', profileError);
        // Don't throw here as the auth user was created successfully
        // The profile can be created later if needed
      }
    }

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
