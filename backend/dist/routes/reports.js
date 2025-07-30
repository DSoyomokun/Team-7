"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const reportController_1 = __importDefault(require("../controllers/reportController"));
const router = express_1.default.Router();
// Get spending report
router.get('/spending', auth_1.authenticateUser, reportController_1.default.getSpendingReport);
// Get income report
router.get('/income', auth_1.authenticateUser, reportController_1.default.getIncomeReport);
// Get budget vs actual report
router.get('/budget-vs-actual', auth_1.authenticateUser, reportController_1.default.getBudgetVsActualReport);
// Get savings report
router.get('/savings', auth_1.authenticateUser, reportController_1.default.getSavingsReport);
// Get comprehensive financial report
router.get('/comprehensive', auth_1.authenticateUser, reportController_1.default.getComprehensiveReport);
exports.default = router;
//# sourceMappingURL=reports.js.map