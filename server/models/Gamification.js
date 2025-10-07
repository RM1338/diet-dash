const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  gameScores: {
    food_sorting: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    },
    meal_creator: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    },
    nutrition_quiz: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    },
    calorie_counter: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    },
    vitamin_match: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    },
    shopping_spree: {
      highScore: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gamification', gamificationSchema);