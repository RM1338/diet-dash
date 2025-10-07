const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['game', 'achievement', 'streak', 'level'],
    default: 'achievement'
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  criteria: {
    type: {
      type: String,
      enum: ['points', 'games_played', 'streak', 'level', 'perfect_score']
    },
    value: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);