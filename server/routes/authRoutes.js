const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Wrap async handlers so errors are passed to Express
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', wrap(register));
router.post('/login', wrap(login));
router.get('/me', protect, wrap(getMe));

module.exports = router;
