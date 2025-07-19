"use strict";
// Utils contain helper functions and utilities used throughout your application
// These are reusable functions that don't belong to specific business logic
// Example utility functions:
// Password hashing
// const bcrypt = require('bcrypt');
// const hashPassword = async (password) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };
// 
// const comparePassword = async (password, hash) => {
//   return await bcrypt.compare(password, hash);
// };
// JWT token utilities
// const jwt = require('jsonwebtoken');
// const generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
// };
// 
// const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };
// Email validation
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };
// Date formatting
// const formatDate = (date) => {
//   return new Date(date).toISOString();
// };
// Random string generation
// const generateRandomString = (length = 10) => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };
// Response formatting
// const formatResponse = (success, data, message = '') => {
//   return {
//     success,
//     data,
//     message,
//     timestamp: new Date().toISOString()
//   };
// };
// Error handling
// const handleError = (error) => {
//   console.error('Error:', error);
//   return {
//     success: false,
//     error: error.message || 'An unexpected error occurred'
//   };
// };
// Database connection utilities
// const connectDB = async () => {
//   try {
//     // Database connection logic
//     console.log('Database connected successfully');
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     process.exit(1);
//   }
// };
// module.exports = {
//   hashPassword,
//   comparePassword,
//   generateToken,
//   verifyToken,
//   validateEmail,
//   formatDate,
//   generateRandomString,
//   formatResponse,
//   handleError,
//   connectDB
// };
console.log('Utils module loaded');
//# sourceMappingURL=index.js.map