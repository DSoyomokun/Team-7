"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../shared/data");
const router = express_1.default.Router();
// POST /auth/register
router.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    // Check if user already exists
    const existingUser = data_1.users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: 'User already exists'
        });
    }
    // Create new user with a mock ID
    const newUser = {
        id: Date.now().toString(),
        email,
        name,
        password: 'mock_hashed_password' // In real implementation, this would be hashed
    };
    data_1.users.push(newUser);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            email: newUser.email,
            name: newUser.name,
            id: newUser.id
        }
    });
});
// POST /auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Find user by email
    const user = data_1.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    // In a real implementation, we would verify the password hash
    // For now, we'll just check if any password was provided
    if (!password) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    // Generate a mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    // Return response with message field to match test expectations
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map