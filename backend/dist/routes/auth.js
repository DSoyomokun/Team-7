"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authAdapter_1 = __importDefault(require("../adapters/authAdapter"));
const router = express_1.default.Router();
// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        const result = await authAdapter_1.default.signUp(email, password, name);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create user'
        });
    }
});
// Register (legacy support)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        const result = await authAdapter_1.default.signUp(email, password, name);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to register user'
        });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        const result = await authAdapter_1.default.login(email, password);
        res.json(result);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Login failed'
        });
    }
});
// Logout
router.post('/logout', async (req, res) => {
    try {
        await authAdapter_1.default.logout();
        res.json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Logout failed'
        });
    }
});
// Get session
router.get('/session', async (req, res) => {
    try {
        const session = await authAdapter_1.default.getSession();
        res.json({
            success: true,
            data: { session }
        });
    }
    catch (error) {
        console.error('Get session error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Failed to get session'
        });
    }
});
// Verify token
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token is required'
            });
        }
        const decoded = await authAdapter_1.default.verifyToken(token);
        res.json({
            success: true,
            data: { user: decoded }
        });
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Invalid token'
        });
    }
});
// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }
        const result = await authAdapter_1.default.refreshToken(refresh_token);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            error: error.message || 'Failed to refresh token'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map