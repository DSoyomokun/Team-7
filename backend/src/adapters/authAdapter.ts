import AuthService from '../services/auth.service';

interface AuthResult {
  user?: any;
  session?: any;
  token?: string;
}

const authAdapter = {
  signUp: async (email: string, password: string): Promise<AuthResult> => {
    return await AuthService.signUp(email, password);
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    return await AuthService.login(email, password);
  },

  logout: async (): Promise<void> => {
    return await AuthService.logout();
  },

  getSession: async (): Promise<any> => {
    return await AuthService.getSession();
  },

  // Additional methods that might be useful for future auth operations
  resetPassword: async (email: string): Promise<any> => {
    // Could be implemented when needed
    throw new Error('resetPassword not yet implemented');
  },

  updatePassword: async (newPassword: string): Promise<any> => {
    // Could be implemented when needed
    throw new Error('updatePassword not yet implemented');
  },

  verifyToken: async (token: string): Promise<any> => {
    // Could be implemented when needed
    throw new Error('verifyToken not yet implemented');
  }
};

export default authAdapter;