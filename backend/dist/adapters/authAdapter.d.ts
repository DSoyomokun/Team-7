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
declare const authAdapter: {
    signUp: (email: string, password: string, name?: string) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<LoginResult>;
    logout: () => Promise<void>;
    getSession: () => Promise<any>;
    verifyToken: (token: string) => Promise<any>;
    refreshToken: (refreshToken: string) => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    updatePassword: (newPassword: string) => Promise<any>;
};
export default authAdapter;
