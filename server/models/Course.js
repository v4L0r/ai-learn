// server/models/Course.js
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

  // Adaptive learner profile — updated after each tutor chat assessment
  learnerProfile: {
    comprehension: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    struggles: [{ type: String }],
    strengths: [{ type: String }],
    preferredStyle: { type: String, default: '' },
    pace: {
      type: String,
      enum: ['slow', 'moderate', 'fast'],
      default: 'moderate',
    },
    notes: { type: String, default: '' },
    lastAssessedChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);