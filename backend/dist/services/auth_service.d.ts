export default class AuthService {
    /**
     * Sign up a new user.
     */
    static signUp(email: string, password: string, name?: string): Promise<any>;
    /**
     * Login a user.
     */
    static login(email: string, password: string): Promise<any>;
    /**
     * Logout current user/session
     */
    static logout(): Promise<void>;
    /**
     * Get current session
     */
    static getSession(): Promise<any>;
}
