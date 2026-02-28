const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback-dev-secret',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password });
    res.status(201).json({
      token: getToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    const msg = err && (err.message || err.reason) || 'Server error';
    // Mongoose validation
    if (err.name === 'ValidationError' && err.errors) {
      const first = err.errors[Object.keys(err.errors)[0]];
      return res.status(400).json({ message: (first && first.message) || msg });
    }
    // MongoDB duplicate key (email unique)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: msg });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      token: getToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
