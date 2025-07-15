const { users } = require('../shared/data');
const bcrypt = require('bcrypt');

const authController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        password: hashedPassword
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
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error hashing password' });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
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
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error verifying password' });
    }
  }
};

module.exports = authController; 