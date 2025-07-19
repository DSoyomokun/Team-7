"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const transactions_1 = __importDefault(require("./transactions"));
const budget_1 = __importDefault(require("./budget"));
const router = express_1.default.Router();
// Mount routes
router.use('/auth', auth_1.default);
router.use('/transactions', transactions_1.default);
router.use('/budget', budget_1.default);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
exports.default = router;
//# sourceMappingURL=index.js.map