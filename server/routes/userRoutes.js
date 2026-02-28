// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  changePassword,
  deleteAccount,
} = require('../controllers/userController');

router.use(protect); // all routes require auth

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.put('/password', changePassword);
router.delete('/', deleteAccount);

module.exports = router;