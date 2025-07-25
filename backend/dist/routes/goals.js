"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const goalController_1 = __importDefault(require("../controllers/goalController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticateUser);
// POST /api/goals - Create new goal
router.post('/', goalController_1.default.createGoal);
// GET /api/goals - List all goals for user (with optional filters)
router.get('/', goalController_1.default.getGoals);
// GET /api/goals/analytics - Get goal analytics and summary
router.get('/analytics', goalController_1.default.getAnalytics);
// GET /api/goals/recommendations - Get goal recommendations
router.get('/recommendations', goalController_1.default.getRecommendations);
// POST /api/goals/sync - Sync goal progress from transactions
router.post('/sync', goalController_1.default.syncProgressFromTransactions);
// GET /api/goals/:id - Get single goal by ID
router.get('/:id', goalController_1.default.getGoalById);
// PUT /api/goals/:id - Update goal
router.put('/:id', goalController_1.default.updateGoal);
// DELETE /api/goals/:id - Delete goal
router.delete('/:id', goalController_1.default.deleteGoal);
// PUT /api/goals/:id/progress - Update goal progress
router.put('/:id/progress', goalController_1.default.updateProgress);
// POST /api/goals/:id/complete - Mark goal as completed
router.post('/:id/complete', goalController_1.default.markCompleted);
exports.default = router;
//# sourceMappingURL=goals.js.map