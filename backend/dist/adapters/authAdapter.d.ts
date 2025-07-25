interface AuthResult {
    user?: any;
    session?: any;
    token?: string;
}
declare const authAdapter: {
    signUp: (email: string, password: string, name?: string) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<AuthResult>;
    logout: () => Promise<void>;
    getSession: () => Promise<any>;
    resetPassword: (email: string) => Promise<any>;
    updatePassword: (newPassword: string) => Promise<any>;
    verifyToken: (token: string) => Promise<any>;
};
export default authAdapter;
