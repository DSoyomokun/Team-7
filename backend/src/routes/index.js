// Routes define your API endpoints and URL structure
// Each route file should correspond to a specific resource

const express = require('express');
const router = express.Router();

// Example route structure:

// GET /api/users - Get all users
// router.get('/users', userController.getAll);

// GET /api/users/:id - Get user by ID
// router.get('/users/:id', userController.getById);

// POST /api/users - Create new user
// router.post('/users', userController.create);

// PUT /api/users/:id - Update user
// router.put('/users/:id', userController.update);

// DELETE /api/users/:id - Delete user
// router.delete('/users/:id', userController.delete);

// Example with middleware:
// router.get('/users', authMiddleware, userController.getAll);

// Example with validation:
// router.post('/users', validateUserData, userController.create);

// Example nested routes:
// router.use('/users/:userId/posts', postRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Example API versioning:
// router.use('/v1', v1Routes);
// router.use('/v2', v2Routes);

module.exports = router;

console.log('Routes module loaded'); 