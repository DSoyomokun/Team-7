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
    static signUp(email: string, password: string, name?: string): Promise<AuthResponse>;
    /**
     * Login a user with proper token generation
     */
    static login(email: string, password: string): Promise<LoginResponse>;
    /**
     * Logout current user/session
     */
    static logout(): Promise<void>;
    /**
     * Get current session
     */
    static getSession(): Promise<any>;
    /**
     * Verify JWT token
     */
    static verifyToken(token: string): Promise<any>;
    /**
     * Refresh access token
     */
    static refreshToken(refreshToken: string): Promise<any>;
}
export {};
