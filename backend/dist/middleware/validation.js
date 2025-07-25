"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePreferencesUpdate = exports.validateProfileUpdate = exports.validateLogin = exports.validateSignUp = void 0;
const User_1 = require("../models/User");
const validateSignUp = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    next();
};
exports.validateSignUp = validateSignUp;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const validateProfileUpdate = (req, res, next) => {
    const { full_name, currency_preference } = req.body;
    // Validate full_name if provided
    if (full_name !== undefined) {
        if (typeof full_name !== 'string' && full_name !== null) {
            res.status(400).json({ error: 'Full name must be a string or null' });
            return;
        }
        if (full_name && full_name.trim().length === 0) {
            res.status(400).json({ error: 'Full name cannot be empty' });
            return;
        }
        if (full_name && full_name.length > 100) {
            res.status(400).json({ error: 'Full name cannot exceed 100 characters' });
            return;
        }
    }
    // Validate currency_preference if provided
    if (currency_preference !== undefined) {
        if (typeof currency_preference !== 'string') {
            res.status(400).json({ error: 'Currency preference must be a string' });
            return;
        }
        if (!User_1.SUPPORTED_CURRENCIES.includes(currency_preference)) {
            res.status(400).json({
                error: `Unsupported currency: ${currency_preference}. Supported currencies: ${User_1.SUPPORTED_CURRENCIES.join(', ')}`
            });
            return;
        }
    }
    next();
};
exports.validateProfileUpdate = validateProfileUpdate;
const validatePreferencesUpdate = (req, res, next) => {
    const { currency_preference } = req.body;
    // Validate currency_preference if provided
    if (currency_preference !== undefined) {
        if (typeof currency_preference !== 'string') {
            res.status(400).json({ error: 'Currency preference must be a string' });
            return;
        }
        if (!User_1.SUPPORTED_CURRENCIES.includes(currency_preference)) {
            res.status(400).json({
                error: `Unsupported currency: ${currency_preference}. Supported currencies: ${User_1.SUPPORTED_CURRENCIES.join(', ')}`
            });
            return;
        }
    }
    next();
};
exports.validatePreferencesUpdate = validatePreferencesUpdate;
//# sourceMappingURL=validation.js.map