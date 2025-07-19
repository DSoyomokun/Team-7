"use strict";
// Main server file - Entry point for your Node.js backend
// This file sets up your Express server and connects all the pieces
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
const log = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};
app.use(log);
// Use routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found'
    });
});
// Start server if not in test environment
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map