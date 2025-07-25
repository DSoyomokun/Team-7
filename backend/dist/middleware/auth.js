"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const database_1 = require("../config/database");
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const { data, error } = await database_1.supabase.auth.getUser(token);
        if (error || !data?.user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = data.user;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.js.map