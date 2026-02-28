const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: { type: String, required: true, trim: true },
    response: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);