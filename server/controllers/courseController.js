// server/controllers/courseController.js
const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const {
  generateChapterContent,
  generateMixedQuiz,
  gradeOpenEndedResponse,
  generateInteractiveWidget,   // ← this is what you actually export from aiService
  getChatResponse,
  assessChatSession,
} = require('../services/aiService');

// ─────────────────────────────────────────────
// GET /api/courses
// ─────────────────────────────────────────────
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });

  const enriched = await Promise.all(
    courses.map(async (course) => {
      const chapters = await Chapter.find({ course: course._id }).select('completed');
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        topic: course.topic,
        chapters: course.chapters,
        completedCount: chapters.filter((ch) => ch.completed).length,
        totalChapters: chapters.length,
        createdAt: course.createdAt,
      };
    })
  );

  res.json(enriched);
});

// ─────────────────────────────────────────────
// GET /api/stats
// ─────────────────────────────────────────────
const getDailyStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ user: req.user._id }).select('_id');
  const courseIds = courses.map((c) => c._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const completedToday = await Chapter.countDocuments({
    course: { $in: courseIds },
    completed: true,
    updatedAt: { $gte: today, $lt: tomorrow },
  });

  const totalCompleted = await Chapter.countDocuments({
    course: { $in: courseIds },
    completed: true,
  });

  const totalChapters = await Chapter.countDocuments({
    course: { $in: courseIds },
  });

  res.json({
    completedToday,
    totalCompleted,
    totalChapters,
    totalCourses: courseIds.length,
  });
});

// ─────────────────────────────────────────────
// GET /api/courses/:id
// ─────────────────────────────────────────────
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  if (course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const chapters = await Chapter.find({ course: course._id })
    .sort({ order: 1 })
    .select('title order content completed quizScore quiz');

  const chaptersWithStatus = chapters.map((ch, i) => {
    const prevCompleted = i === 0 || chapters[i - 1].completed;
    return {
      _id: ch._id,
      title: ch.title,
      order: ch.order,
      hasContent: ch.content && ch.content.length > 0,
      hasQuiz: ch.quiz && ch.quiz.questions && ch.quiz.questions.length > 0,
      completed: ch.completed,
      quizScore: ch.quizScore,
      unlocked: prevCompleted,
    };
  });

  res.json({
    _id: course._id,
    title: course.title,
    description: course.description,
    topic: course.topic,
    chapters: chaptersWithStatus,
  });
});

// ─────────────────────────────────────────────
// GET /api/chapters/:id
// ─────────────────────────────────────────────
const getChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const course = await Course.findById(chapter.course);
  if (course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(chapter);
});

// ─────────────────────────────────────────────
// POST /api/chapters/:id/generate
// ─────────────────────────────────────────────
const generateContent = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const course = await Course.findById(chapter.course);
  if (course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // ── Progression gate ──
  if (chapter.order > 1) {
    const prevChapter = await Chapter.findOne({
      course: chapter.course,
      order: chapter.order - 1,
    });

    if (prevChapter && !prevChapter.completed) {
      return res.status(403).json({
        message: `You must pass the quiz for "${prevChapter.title}" before unlocking this chapter.`,
      });
    }
  }

  // Already generated — return as-is
  if (chapter.content) {
    return res.json(chapter);
  }

  const user = await User.findById(req.user._id);
  const difficulty = user?.settings?.difficulty || 'intermediate';

  const chapterMeta = course.chapters.find(
    (ch) => ch.chapterRef && ch.chapterRef.toString() === chapter._id.toString()
  );

  // ── 1. Generate chapter content ──
  console.log('[CHAPTER] Generating content for:', chapter.title);
  const content = await generateChapterContent(
    course.title,
    chapter.title,
    chapterMeta?.description || chapter.title,
    course.learnerProfile,
    difficulty
  );
  chapter.content = content;
  console.log('[CHAPTER] Content saved, length:', content.length);

  // ── 2. Generate mixed quiz (MCQ + open-ended) ──
  try {
    console.log('[CHAPTER] Generating mixed quiz...');
    const quizQuestions = await generateMixedQuiz(
      content,
      difficulty,
      course.learnerProfile || null
    );
    chapter.quiz = {
      questions: quizQuestions,
      mcqWeight: 50,
      openEndedWeight: 50,
      passingScore: 70,
      score: null,
      passed: false,
      attempts: 0,
    };
    console.log('[CHAPTER] Quiz generated:', quizQuestions.length, 'questions');
  } catch (err) {
    console.error('[CHAPTER] Quiz generation failed (non-fatal):', err.message);
    // Leave quiz empty — user can still read the content
    chapter.quiz = {
      questions: [],
      mcqWeight: 50,
      openEndedWeight: 50,
      passingScore: 70,
      score: null,
      passed: false,
      attempts: 0,
    };
  }

  // ── 3. Generate interactive widget (best-effort) ──
  try {
    console.log('[CHAPTER] Generating interactive widget...');
    const interactive = await generateInteractiveWidget(
      course.title,
      chapter.title,
      content
    );
    chapter.interactive = interactive;
    console.log('[CHAPTER] Interactive widget saved, length:', interactive.length);
  } catch (err) {
    console.error('[CHAPTER] Interactive generation failed (non-fatal):', err.message);
    chapter.interactive = '';
  }

  await chapter.save();

  if (chapterMeta) {
    chapterMeta.generated = true;
    await course.save();
  }

  res.json(chapter);
});

// ─────────────────────────────────────────────
// POST /api/chapters/:id/interactive
// ─────────────────────────────────────────────
const generateInteractive = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  const course = await Course.findById(chapter.course);
  if (course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (!chapter.content) {
    return res.status(400).json({ message: 'Generate chapter content first' });
  }

  if (chapter.interactive) {
    return res.json({ interactive: chapter.interactive });
  }

  console.log('[INTERACTIVE] Generating widget for:', chapter.title);
  const interactive = await generateInteractiveWidget(
    course.title,
    chapter.title,
    chapter.content
  );
  chapter.interactive = interactive;
  await chapter.save();

  console.log('[INTERACTIVE] Widget saved, length:', interactive.length);
  res.json({ interactive: chapter.interactive });
});

// ─────────────────────────────────────────────
// POST /api/chapters/:id/quiz — grade a submission
// ─────────────────────────────────────────────
const handleQuiz = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

  const course = await Course.findById(chapter.course);
  if (!course || course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorised' });
  }

  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Answers array is required' });
  }

  const questions = chapter.quiz.questions;
  if (!questions || questions.length === 0) {
    return res.status(400).json({ message: 'No quiz questions found for this chapter' });
  }

  const results = [];
  let mcqCorrect = 0;
  let mcqTotal = 0;
  let oeScoreSum = 0;
  let oeTotal = 0;

  // ── 1. Instant-grade MCQs ──
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q.type === 'open_ended') continue;

    mcqTotal++;
    const submitted = answers.find((a) => a.questionIndex === i);
    const isCorrect = submitted?.answer === q.correctAnswer;
    if (isCorrect) mcqCorrect++;

    results.push({
      questionIndex: i,
      type: 'mcq',
      question: q.question,
      correct: isCorrect,
      selectedAnswer: submitted?.answer || null,
      correctAnswer: q.correctAnswer,
      options: q.options,
    });
  }

  // ── 2. AI-grade open-ended (parallel) ──
  const oeJobs = [];
  const oeIndices = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q.type !== 'open_ended') continue;

    oeTotal++;
    oeIndices.push(i);
    const submitted = answers.find((a) => a.questionIndex === i);
    const studentText = submitted?.answer?.trim() || '';

    if (!studentText) {
      oeJobs.push(Promise.resolve({ score: 0, feedback: 'No response was provided.' }));
    } else {
      oeJobs.push(
        gradeOpenEndedResponse(q.question, q.gradingCriteria, q.sampleAnswer, studentText)
      );
    }
  }

  const oeGrades = await Promise.all(oeJobs);

  for (let j = 0; j < oeIndices.length; j++) {
    const i = oeIndices[j];
    const q = questions[i];
    const submitted = answers.find((a) => a.questionIndex === i);
    const grade = oeGrades[j];

    oeScoreSum += grade.score;

    q.studentResponse = submitted?.answer || '';
    q.aiScore = grade.score;
    q.aiFeedback = grade.feedback;

    results.push({
      questionIndex: i,
      type: 'open_ended',
      question: q.question,
      studentResponse: q.studentResponse,
      aiScore: grade.score,
      aiFeedback: grade.feedback,
      sampleAnswer: q.sampleAnswer,
    });
  }

  // ── 3. Weighted score ──
  const mcqPct = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 100 : 0;
  const oePct = oeTotal > 0 ? oeScoreSum / oeTotal : 0;

  const { mcqWeight = 50, openEndedWeight = 50, passingScore = 70 } = chapter.quiz;

  let finalScore;
  if (mcqTotal === 0 && oeTotal === 0) finalScore = 0;
  else if (oeTotal === 0) finalScore = mcqPct;
  else if (mcqTotal === 0) finalScore = oePct;
  else finalScore = (mcqPct * mcqWeight + oePct * openEndedWeight) / (mcqWeight + openEndedWeight);

  finalScore = Math.round(finalScore * 10) / 10;
  const passed = finalScore >= passingScore;

  // ── 4. Persist ──
  chapter.quiz.score = finalScore;
  chapter.quiz.passed = passed;
  chapter.quiz.attempts = (chapter.quiz.attempts || 0) + 1;

  // Mark chapter completed if passed
  if (passed) {
    chapter.completed = true;
  }

  await chapter.save();

  // Update user stats
  const user = await User.findById(req.user._id);
  if (user) {
    user.stats.quizzesTaken = (user.stats.quizzesTaken || 0) + 1;
    const prevTotal = (user.stats.averageScore || 0) * (user.stats.quizzesTaken - 1);
    user.stats.averageScore = Math.round((prevTotal + finalScore) / user.stats.quizzesTaken);
    user.stats.lastActiveDate = new Date();
    await user.save();
  }

  results.sort((a, b) => a.questionIndex - b.questionIndex);

  res.json({
    score: finalScore,
    passed,
    passingScore,
    mcqScore: Math.round(mcqPct * 10) / 10,
    openEndedScore: Math.round(oePct * 10) / 10,
    mcqWeight: mcqTotal > 0 ? mcqWeight : 0,
    openEndedWeight: oeTotal > 0 ? openEndedWeight : 0,
    attempts: chapter.quiz.attempts,
    results,
  });
});


// ─────────────────────────────────────────────
// DELETE /api/courses/:id
// ─────────────────────────────────────────────
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  if (course.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Delete all chapters belonging to this course
  await Chapter.deleteMany({ course: course._id });

  // Delete the course itself
  await course.deleteOne();

  res.json({ message: 'Course deleted' });
});



module.exports = {
  getCourses,
  getCourse,
  getChapter,
  generateContent,
  handleQuiz,
  getDailyStats,
  generateInteractive,
  deleteCourse,
};