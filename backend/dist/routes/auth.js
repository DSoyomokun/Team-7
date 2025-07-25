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
        const result = await authAdapter_1.default.signUp(email, password, name);
        res.status(201).json({ message: 'User created successfully', data: result });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Register (legacy support)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await authAdapter_1.default.signUp(email, password, name);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authAdapter_1.default.login(email, password);
        res.json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});
// Logout
router.post('/logout', async (req, res) => {
    try {
        await authAdapter_1.default.logout();
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get session
router.get('/session', async (req, res) => {
    try {
        const session = await authAdapter_1.default.getSession();
        res.json({ session });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map