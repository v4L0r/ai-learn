// server/controllers/chatController.js
const asyncHandler = require('express-async-handler');
const ChatMessage = require('../models/ChatMessage');
const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const { generateTutorResponse, assessLearner } = require('../services/aiService');

// GET /api/courses/:courseId/chapters/:chapterId/chat
const getChatHistory = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;

  const course = await Course.findById(courseId);
  if (!course || course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const messages = await ChatMessage.find({
    user: req.user._id,
    course: courseId,
    chapter: chapterId,
  }).sort({ createdAt: 1 });

  res.json({ messages });
});

// POST /api/courses/:courseId/chapters/:chapterId/chat
const sendMessage = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const course = await Course.findById(courseId);
  if (!course || course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter || !chapter.content) {
    return res.status(400).json({ message: 'Chapter content not generated yet' });
  }

  // Fetch existing conversation
  const history = await ChatMessage.find({
    user: req.user._id,
    course: courseId,
    chapter: chapterId,
  }).sort({ createdAt: 1 });

  // Save user message
  const userMsg = await ChatMessage.create({
    user: req.user._id,
    course: courseId,
    chapter: chapterId,
    role: 'user',
    content: message.trim(),
  });

  // Generate tutor response
  console.log('[CHAT] Generating tutor response for:', chapter.title);
  const tutorReply = await generateTutorResponse(
    course.title,
    chapter.title,
    chapter.content,
    history.map((m) => ({ role: m.role, content: m.content })),
    message.trim()
  );

  // Save assistant message
  const assistantMsg = await ChatMessage.create({
    user: req.user._id,
    course: courseId,
    chapter: chapterId,
    role: 'assistant',
    content: tutorReply,
  });

  res.json({
    userMessage: {
      _id: userMsg._id,
      role: 'user',
      content: userMsg.content,
      createdAt: userMsg.createdAt,
    },
    assistantMessage: {
      _id: assistantMsg._id,
      role: 'assistant',
      content: assistantMsg.content,
      createdAt: assistantMsg.createdAt,
    },
  });
});

// POST /api/courses/:courseId/chapters/:chapterId/chat/assess
const assessChat = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;

  const course = await Course.findById(courseId);
  if (!course || course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const messages = await ChatMessage.find({
    user: req.user._id,
    course: courseId,
    chapter: chapterId,
  }).sort({ createdAt: 1 });

  if (messages.length < 2) {
    return res.status(400).json({
      message: 'Chat with the tutor a bit more before assessing',
    });
  }

  console.log('[ASSESS] Assessing learner from', messages.length, 'messages');
  const assessment = await assessLearner(
    course.title,
    chapter.title,
    messages.map((m) => ({ role: m.role, content: m.content }))
  );

  // Merge with existing profile — struggles/strengths accumulate
  const existing = course.learnerProfile || {};
  const mergedStruggles = [
    ...new Set([...(existing.struggles || []), ...(assessment.struggles || [])]),
  ].slice(-10);
  const mergedStrengths = [
    ...new Set([...(existing.strengths || []), ...(assessment.strengths || [])]),
  ].slice(-10);

  course.learnerProfile = {
    comprehension: assessment.comprehension || existing.comprehension || 'medium',
    struggles: mergedStruggles,
    strengths: mergedStrengths,
    preferredStyle: assessment.preferredStyle || existing.preferredStyle || '',
    pace: assessment.pace || existing.pace || 'moderate',
    notes: assessment.notes || existing.notes || '',
    lastAssessedChapter: chapterId,
  };

  await course.save();
  console.log('[ASSESS] Learner profile updated for course:', course.title);

  res.json({
    assessment,
    learnerProfile: course.learnerProfile,
  });
});

module.exports = { getChatHistory, sendMessage, assessChat };