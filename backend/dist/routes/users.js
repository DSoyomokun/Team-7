"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Get user profile
router.get('/profile', auth_1.authenticateUser, userController_1.default.getProfile);
// Update user profile
router.put('/profile', auth_1.authenticateUser, validation_1.validateProfileUpdate, userController_1.default.updateProfile);
// Delete user account
router.delete('/account', auth_1.authenticateUser, userController_1.default.deleteAccount);
// Get user preferences
router.get('/preferences', auth_1.authenticateUser, userController_1.default.getPreferences);
// Update user preferences
router.put('/preferences', auth_1.authenticateUser, validation_1.validatePreferencesUpdate, userController_1.default.updatePreferences);
// Get user statistics
router.get('/stats', auth_1.authenticateUser, userController_1.default.getUserStats);
// Change password
router.put('/password', auth_1.authenticateUser, userController_1.default.changePassword);
// Search users (public endpoint with rate limiting recommended)
router.get('/search', userController_1.default.searchUsers);
// Get all users (admin only - add admin middleware when implemented)
router.get('/all', auth_1.authenticateUser, userController_1.default.getAllUsers);
exports.default = router;
//# sourceMappingURL=users.js.map