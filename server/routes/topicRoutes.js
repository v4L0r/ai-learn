const express = require('express');
const { createTopic, getTopics } = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createTopic);
router.get('/', getTopics);

module.exports = router;
