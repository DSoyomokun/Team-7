import AuthService from '../services/auth_service';

interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

interface AuthResult {
  user?: AuthUser;
  session?: any;
  access_token?: string;
  refresh_token?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
  };
}

const authAdapter = {
  signUp: async (email: string, password: string, name?: string): Promise<AuthResult> => {
    try {
      return await AuthService.signUp(email, password, name);
    } catch (error: any) {
      console.error('AuthAdapter signUp error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  },

  login: async (email: string, password: string): Promise<LoginResult> => {
    try {
      return await AuthService.login(email, password);
    } catch (error: any) {
      console.error('AuthAdapter login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  },

  logout: async (): Promise<void> => {
    try {
      return await AuthService.logout();
    } catch (error: any) {
      console.error('AuthAdapter logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  },

  getSession: async (): Promise<any> => {
    try {
      return await AuthService.getSession();
    } catch (error: any) {
      console.error('AuthAdapter getSession error:', error);
      throw new Error(error.message || 'Failed to get session');
    }
  },

  verifyToken: async (token: string): Promise<any> => {
    try {
      return await AuthService.verifyToken(token);
    } catch (error: any) {
      console.error('AuthAdapter verifyToken error:', error);
      throw new Error(error.message || 'Failed to verify token');
    }
  },

  refreshToken: async (refreshToken: string): Promise<any> => {
    try {
      return await AuthService.refreshToken(refreshToken);
    } catch (error: any) {
      console.error('AuthAdapter refreshToken error:', error);
      throw new Error(error.message || 'Failed to refresh token');
    }
  },

  // Additional methods that might be useful for future auth operations
  resetPassword: async (email: string): Promise<any> => {
    // Could be implemented when needed
    throw new Error('resetPassword not yet implemented');
  },

  updatePassword: async (newPassword: string): Promise<any> => {
    // Could be implemented when needed
    throw new Error('updatePassword not yet implemented');
  }
};

export default authAdapter;