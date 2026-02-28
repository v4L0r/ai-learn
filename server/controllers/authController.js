const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hackathon_super_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('══════════════════════════════════════');
    console.log('[AUTH] Registration attempt');
    console.log('[AUTH] Email:', email);
    console.log('[AUTH] Name :', name);
    console.log('[AUTH] Time :', new Date().toISOString());

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('[AUTH] FAILED — email already exists:', email);
      console.log('══════════════════════════════════════');
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      console.log('[AUTH] SUCCESS — user created');
      console.log('[AUTH] User ID:', user.id);
      console.log('══════════════════════════════════════');
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('[AUTH] FAILED — invalid user data');
      console.log('══════════════════════════════════════');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('[AUTH] ERROR —', error.message);
    console.log('══════════════════════════════════════');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('══════════════════════════════════════');
    console.log('[AUTH] Login attempt');
    console.log('[AUTH] Email:', email);
    console.log('[AUTH] Time :', new Date().toISOString());

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      console.log('[AUTH] SUCCESS — logged in');
      console.log('[AUTH] User ID:', user.id);
      console.log('[AUTH] Name  :', user.name);
      console.log('══════════════════════════════════════');
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('[AUTH] FAILED — invalid credentials');
      if (!user) console.log('[AUTH] Reason: no user found with that email');
      else console.log('[AUTH] Reason: password mismatch');
      console.log('══════════════════════════════════════');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log('[AUTH] ERROR —', error.message);
    console.log('══════════════════════════════════════');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};