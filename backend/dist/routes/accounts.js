"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = __importDefault(require("../controllers/accountController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All account routes require authentication
router.use(auth_1.authenticateUser);
// POST /api/accounts - Create new account
router.post('/', accountController_1.default.create);
// GET /api/accounts - Get all user accounts
router.get('/', accountController_1.default.getAll);
// GET /api/accounts/summary - Get account balance summary
router.get('/summary', accountController_1.default.getBalanceSummary);
// GET /api/accounts/:id - Get specific account
router.get('/:id', accountController_1.default.getById);
// PUT /api/accounts/:id - Update account
router.put('/:id', accountController_1.default.update);
// DELETE /api/accounts/:id - Delete account
router.delete('/:id', accountController_1.default.delete);
exports.default = router;
//# sourceMappingURL=accounts.js.map