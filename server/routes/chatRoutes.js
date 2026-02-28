// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getChatHistory, sendMessage, assessChat } = require('../controllers/chatController');

router.get('/courses/:courseId/chapters/:chapterId/chat', protect, getChatHistory);
router.post('/courses/:courseId/chapters/:chapterId/chat', protect, sendMessage);
router.post('/courses/:courseId/chapters/:chapterId/chat/assess', protect, assessChat);

module.exports = router;