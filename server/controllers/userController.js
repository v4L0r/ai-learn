// server/controllers/userController.js
const User = require('../models/User');

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      bio: user.bio,
      stats: user.stats,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (displayName !== undefined) user.displayName = displayName.trim();
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    res.json({
      displayName: user.displayName,
      bio: user.bio,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/user/settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ settings: user.settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/settings
exports.updateSettings = async (req, res) => {
  try {
    const allowed = ['dailyGoal', 'difficulty', 'autoStartQuiz', 'emailReminders', 'weeklyDigest'];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[`settings.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ settings: user.settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/user
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};