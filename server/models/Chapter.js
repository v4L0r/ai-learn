// server/models/Chapter.js
const mongoose = require('mongoose');

/* ── NEW: dedicated sub-schema so we can add type + AI grading fields ── */
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'open_ended'],
    default: 'mcq',
  },
  question: { type: String, required: true },

  // MCQ-specific
  options: [String],
  correctAnswer: String,

  // Open-ended specific
  gradingCriteria: String,   // tells AI what a good answer covers
  sampleAnswer: String,      // reference answer for the AI grader

  // Filled after grading
  studentResponse: String,
  aiScore: { type: Number, default: null },   // 0-100
  aiFeedback: String,
});

const chapterSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  order: { type: Number, default: 0 },
  generated: { type: Boolean, default: false },

  quiz: {
    questions: [questionSchema],

    /* NEW — weighting & passing */
    mcqWeight:        { type: Number, default: 50 },
    openEndedWeight:  { type: Number, default: 50 },
    passingScore:     { type: Number, default: 70 },

    score:    { type: Number, default: null },
    passed:   { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
  },

  interactiveElements: [{
    type: { type: String },
    title: String,
    htmlContent: String,
    order: Number,
    generated: { type: Boolean, default: false },
  }],

  chatHistory: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);