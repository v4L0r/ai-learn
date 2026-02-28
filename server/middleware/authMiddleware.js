const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('[AUTH MW] Token found:', token.substring(0, 20) + '...');

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hackathon_super_secret'
      );

      req.user = await User.findById(decoded.id).select('-password');
      console.log('[AUTH MW] User verified:', req.user?.email);
      return next();
    } catch (error) {
      console.error('[AUTH MW] Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('[AUTH MW] No token in header');
  console.log('[AUTH MW] Authorization header:', req.headers.authorization || 'MISSING');
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protect };