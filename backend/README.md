# Team 7 Backend API

This is the backend API for the Team 7 project, built with Express.js and Supabase.

## Features

- User authentication (signup, login, logout)
- User profile management
- Transaction management
- Spending analysis
- Recurring payment detection

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

3. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/analyze/:category` - Analyze spending by category
- `GET /api/transactions/recurring` - Get recurring payments

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Route controllers
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── validation.js       # Request validation
│   ├── models/
│   │   ├── Transaction.js      # Transaction model
│   │   ├── User.js            # User model
│   │   └── repositories/      # Data access layer
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── user.routes.js     # User routes
│   │   └── transaction.routes.js # Transaction routes
│   ├── services/
│   │   ├── auth.service.js    # Authentication service
│   │   ├── user.js           # User service
│   │   └── transaction_service.js # Transaction service
│   ├── utils/
│   │   └── auth.js           # Auth utilities
│   └── server.js             # Main server file
├── package.json
└── README.md
```

## Security

- Rate limiting enabled
- Helmet.js for security headers
- CORS enabled
- Input validation
- Authentication middleware

## Development

- Use `npm run dev` for development with auto-restart
- Use `npm test` to run tests
- Check `/health` endpoint for server status 