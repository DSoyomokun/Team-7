// Main server file - Entry point for your Node.js backend
// This file sets up your Express server and connects all the pieces

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import your modules
const routes = require('./routes');
// const middlewares = require('./middlewares');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Team-7 Budget API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app; 