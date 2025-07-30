import { supabase } from '../config/database';
import { hashPassword, comparePasswords } from '../utils/auth';
import { UserRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';

// Types for better type safety
interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

interface AuthResponse {
  user: AuthUser;
  session: any;
  access_token: string;
  refresh_token: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
  };
}

export default class AuthService {
  /**
   * Sign up a new user with proper error handling and profile creation
   */
  static async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser.users?.some(user => user.email === email);
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      // Create user with Supabase Auth
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

      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Failed to create user');
      }

      // Create user profile in our database
      try {
        await UserRepository.create({
          user_id: data.user.id,
          full_name: name || undefined,
          email: email,
          currency_preference: 'USD',
          created_at: new Date().toISOString()
        });
      } catch (profileError) {
        console.error('Failed to create user profile:', profileError);
        // Don't throw here as the auth user was created successfully
        // The profile can be created later if needed
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          full_name: name || '',
          created_at: data.user.created_at
        },
        session: data.session,
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || ''
      };
    } catch (error: any) {
      console.error('AuthService signup error:', error);
      throw new Error(error.message || 'Failed to create user');
    }
  }

  /**
   * Login a user with proper token generation
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

      if (error) {
        console.error('Supabase login error:', error);
        throw new Error('Invalid email or password');
      }

      if (!data.user || !data.session) {
        throw new Error('Authentication failed');
      }

      // Generate JWT token for additional security
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const accessToken = jwt.sign(
        { 
          userId: data.user.id, 
          email: data.user.email,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        jwtSecret
      );

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || '',
            created_at: data.user.created_at
          },
          access_token: accessToken,
          refresh_token: data.session.refresh_token
        }
      };
    } catch (error: any) {
      console.error('AuthService login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Logout current user/session
   */
  static async logout(): Promise<void> {
    try {
    const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('AuthService logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  }

  /**
   * Get current session
   */
  static async getSession(): Promise<any> {
    try {
    const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase getSession error:', error);
        throw new Error(error.message);
      }
    return data.session;
    } catch (error: any) {
      console.error('AuthService getSession error:', error);
      throw new Error(error.message || 'Failed to get session');
    }
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error: any) {
      console.error('AuthService verifyToken error:', error);
      throw new Error('Invalid token');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<any> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      console.error('AuthService refreshToken error:', error);
      throw new Error(error.message || 'Failed to refresh token');
    }
  }
}
