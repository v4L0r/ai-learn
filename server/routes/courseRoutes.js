// server/routes/courseRoutes.js
const express = require('express');
const { getCourses, getCourse, getDailyStats, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/stats', protect, getDailyStats);
router.get('/:id', protect, getCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;