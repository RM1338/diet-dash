const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Gamification = require('../models/Gamification');
const Badge = require('../models/Badge');
const User = require('../models/User');

// Get user progress
router.get('/progress/:userId', auth, async (req, res) => {
  try {
    const gamification = await Gamification.findOne({ userId: req.params.userId });
    
    if (!gamification) {
      return res.status(404).json({ message: 'Gamification data not found' });
    }

    res.json({ data: gamification });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user badges
router.get('/badges/:userId', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.params.userId });
    res.json({ data: badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { gameType } = req.query;
    
    if (gameType) {
      // Game-specific leaderboard
      const leaderboard = await Gamification.find()
        .populate('userId', 'username profile.avatar')
        .sort({ [`gameScores.${gameType}.highScore`]: -1 })
        .limit(10);
      
      return res.json({ leaderboard });
    }
    
    // Overall leaderboard
    const users = await User.find()
      .select('username profile.avatar gamification.totalPoints gamification.level')
      .sort({ 'gamification.totalPoints': -1 })
      .limit(10);
    
    const leaderboard = users.map(user => ({
      _id: user._id,
      username: user.username,
      profile: user.profile,
      totalPoints: user.gamification?.totalPoints || 0,
      level: user.gamification?.level || 1
    }));
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Award points
router.post('/points', auth, async (req, res) => {
  try {
    const { userId, points, gameType } = req.body;
    
    let gamification = await Gamification.findOne({ userId });
    
    if (!gamification) {
      gamification = new Gamification({ userId });
    }
    
    gamification.totalPoints += points;
    gamification.level = Math.floor(gamification.totalPoints / 100) + 1;
    
    await gamification.save();
    
    // Update user model
    await User.findByIdAndUpdate(userId, {
      'gamification.totalPoints': gamification.totalPoints,
      'gamification.level': gamification.level
    });
    
    res.json({ data: gamification });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;