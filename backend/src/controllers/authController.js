// Controller for authentication logic
// Mock users database (should be replaced with a real DB in production)
let users = [];

// Register a new user
exports.register = (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }
  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    password: 'mock_hashed_password' // In real implementation, this would be hashed
  };
  users.push(newUser);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      email: newUser.email,
      name: newUser.name,
      id: newUser.id
    }
  });
};

// Login a user
exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  if (!password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  const token = `mock_token_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  });
}; 