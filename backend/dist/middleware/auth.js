"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.optionalAuth = exports.authenticateUser = void 0;
const database_1 = require("../config/database");
const auth_service_1 = __importDefault(require("../services/auth_service"));
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }
        // First try to verify with our JWT
        try {
            const decoded = await auth_service_1.default.verifyToken(token);
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                full_name: decoded.full_name,
                created_at: new Date().toISOString()
            };
            return next();
        }
        catch (jwtError) {
            console.log('JWT verification failed, trying Supabase token...');
        }
        // If JWT fails, try Supabase token verification
        try {
            const { data, error } = await database_1.supabase.auth.getUser(token);
            if (error || !data?.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }
            req.user = {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || '',
                created_at: data.user.created_at
            };
            next();
        }
        catch (supabaseError) {
            console.error('Supabase token verification failed:', supabaseError);
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};
exports.authenticateUser = authenticateUser;
// Optional authentication middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return next(); // Continue without user
        }
        // Try to authenticate but don't fail if it doesn't work
        try {
            const decoded = await auth_service_1.default.verifyToken(token);
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                full_name: decoded.full_name,
                created_at: new Date().toISOString()
            };
        }
        catch (jwtError) {
            try {
                const { data, error } = await database_1.supabase.auth.getUser(token);
                if (!error && data?.user) {
                    req.user = {
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.user_metadata?.full_name || '',
                        created_at: data.user.created_at
                    };
                }
            }
            catch (supabaseError) {
                // Silently continue without user
            }
        }
        next();
    }
    catch (error) {
        console.error('Optional auth middleware error:', error);
        next(); // Continue without user
    }
};
exports.optionalAuth = optionalAuth;
// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        // First authenticate the user
        await (0, exports.authenticateUser)(req, res, async () => {
            // Check if user has admin role (you can implement your own admin logic)
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }
            // For now, we'll allow all authenticated users as admin
            // In production, you should check against a roles table
            next();
        });
    }
    catch (error) {
        console.error('Admin authentication error:', error);
        res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
};
exports.authenticateAdmin = authenticateAdmin;
//# sourceMappingURL=auth.js.map