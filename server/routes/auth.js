const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route using the middleware
// This could be used by your client to fetch the current logged-in user's data
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;