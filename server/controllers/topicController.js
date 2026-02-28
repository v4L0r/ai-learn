const Topic = require('../models/Topic');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.createTopic = wrap(async (req, res) => {
  const { title, description } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Please add a title' });
  }
  const topic = await Topic.create({
    title: title.trim(),
    description: (description || '').trim(),
    user: req.user.id,
  });
  res.status(201).json(topic);
});

exports.getTopics = wrap(async (req, res) => {
  const topics = await Topic.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(topics);
});
