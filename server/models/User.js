// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },

  // Profile
  displayName: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 280 },

  // Settings
  settings: {
    dailyGoal: { type: Number, default: 2, min: 1, max: 10 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    autoStartQuiz: { type: Boolean, default: true },
    emailReminders: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: false },
  },

  // Stats — updated as side effects, not computed per request
  stats: {
    coursesStarted: { type: Number, default: 0 },
    coursesCompleted: { type: Number, default: 0 },
    chaptersCompleted: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
  },
}, {
  timestamps: true,
});

// Default displayName to name if not set
userSchema.pre('save', async function (next) {
  if (!this.displayName) {
    this.displayName = this.name;
  }
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);