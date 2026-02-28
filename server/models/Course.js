const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  chapters: [{
    title: String,
    description: String,
    order: Number,
    generated: { type: Boolean, default: false },
    chapterRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
