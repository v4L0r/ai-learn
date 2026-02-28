const asyncHandler = require('express-async-handler');
const Topic = require('../models/Topic');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const { generateCoursePlan } = require('../services/aiService');

const createTopic = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  console.log('──────────────────────────────────────');
  console.log('[TOPIC] New submission');
  console.log('[TOPIC] User ID :', req.user._id);
  console.log('[TOPIC] Prompt  :', prompt);

  // 1. Call AI to get structured course plan
  console.log('[TOPIC] Calling AI for course plan...');
  const plan = await generateCoursePlan(prompt);
  console.log('[TOPIC] Course plan received:', plan.title);

  // 2. Save the topic
  const topic = await Topic.create({
    user: req.user._id,
    prompt,
    response: JSON.stringify(plan),
  });

  // 3. Create the Course
  const course = await Course.create({
    user: req.user._id,
    topic: prompt,
    title: plan.title,
    description: plan.description,
    chapters: [],
  });

  // 4. Create Chapter docs and link them back
  const chapterDocs = [];
  for (const ch of plan.chapters) {
    const chapter = await Chapter.create({
      course: course._id,
      title: ch.title,
      order: ch.order,
      content: '',       // generated on-demand later
      quiz: [],           // generated on-demand later
    });
    chapterDocs.push({
      title: ch.title,
      description: ch.description,
      order: ch.order,
      generated: false,
      chapterRef: chapter._id,
    });
  }

  // 5. Update course with chapter references
  course.chapters = chapterDocs;
  await course.save();

  console.log('[TOPIC] Course created:', course._id);
  console.log('[TOPIC] Chapters created:', chapterDocs.length);

  res.status(201).json({
    topic,
    course: {
      _id: course._id,
      title: course.title,
      description: course.description,
      chapters: course.chapters,
    },
  });
});

const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(topics);
});

module.exports = { createTopic, getTopics };