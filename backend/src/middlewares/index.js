// Middlewares are functions that run between the request and response
// They can modify the request, response, or end the request-response cycle

// Example middleware structure:

// Authentication middleware
// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: 'No token provided' });
//     }
//     
//     // Verify token logic here
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// Validation middleware
// const validateUserData = (req, res, next) => {
//   const { email, password } = req.body;
//   
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   
//   if (!email.includes('@')) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }
//   
//   if (password.length < 6) {
//     return res.status(400).json({ error: 'Password must be at least 6 characters' });
//   }
//   
//   next();
// };

// Error handling middleware
// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// };

// Logging middleware
// const logger = (req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// };

// CORS middleware
// const corsMiddleware = (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   
//   next();
// };

// Rate limiting middleware
// const rateLimit = (req, res, next) => {
//   // Rate limiting logic here
//   next();
// };

// module.exports = {
//   authMiddleware,
//   validateUserData,
//   errorHandler,
//   logger,
//   corsMiddleware,
//   rateLimit
// };

console.log('Middlewares module loaded'); 