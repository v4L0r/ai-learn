// server/routes/chapterRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getChapter, generateContent, handleQuiz, generateInteractive } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getChapter);
router.post('/:id/generate', protect, generateContent);
router.post('/:id/interactive', protect, generateInteractive);
router.post('/:id/quiz', protect, handleQuiz);

module.exports = router;