const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const Gamification = require('../models/Gamification');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific game
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ game });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit game score
router.post('/:gameId/play', auth, async (req, res) => {
  try {
    const { score, gameType } = req.body;
    const userId = req.userId;
    
    // Update or create gamification record
    let gamification = await Gamification.findOne({ userId });
    
    if (!gamification) {
      gamification = new Gamification({ userId });
    }
    
    // Update game-specific scores
    if (gameType && gamification.gameScores[gameType]) {
      gamification.gameScores[gameType].gamesPlayed += 1;
      
      if (score > gamification.gameScores[gameType].highScore) {
        gamification.gameScores[gameType].highScore = score;
      }
    }
    
    // Update total points and level
    gamification.totalPoints += score;
    gamification.level = Math.floor(gamification.totalPoints / 100) + 1;
    gamification.lastActivityDate = new Date();
    
    await gamification.save();
    
    // Update user model
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, {
      'gamification.totalPoints': gamification.totalPoints,
      'gamification.level': gamification.level
    });
    
    res.json({
      success: true,
      data: {
        score,
        totalPoints: gamification.totalPoints,
        level: gamification.level
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;