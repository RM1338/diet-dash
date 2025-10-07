const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['food_sorting', 'meal_creator', 'nutrition_quiz', 'calorie_counter', 'vitamin_match', 'shopping_spree'],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  maxScore: {
    type: Number,
    default: 100
  },
  timeLimit: {
    type: Number, // in seconds
    default: 300
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);