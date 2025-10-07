const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const BADGES = require('../config/badges');

router.get('/progress/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('gamification');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: user.gamification });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/badges/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const unlockedBadges = user.gamification?.badges || [];
    const allBadges = BADGES.map(badge => ({
      ...badge,
      _id: badge.id,
      isUnlocked: unlockedBadges.includes(badge.id)
    }));
    res.json({ data: allBadges });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/points', auth, async (req, res) => {
  try {
    const { points, gameId, perfectScore } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.gamification.totalPoints += points;
    user.gamification.gamesPlayed += 1;
    user.gamification.level = Math.floor(user.gamification.totalPoints / 100) + 1;
    const newBadges = [];
    BADGES.forEach(badge => {
      if (!user.gamification.badges.includes(badge.id)) {
        let shouldUnlock = false;
        if (badge.criteria.gamesPlayed && user.gamification.gamesPlayed >= badge.criteria.gamesPlayed) shouldUnlock = true;
        if (badge.criteria.totalPoints && user.gamification.totalPoints >= badge.criteria.totalPoints) shouldUnlock = true;
        if (badge.criteria.level && user.gamification.level >= badge.criteria.level) shouldUnlock = true;
        if (badge.criteria.perfectScore && perfectScore === true) shouldUnlock = true;
        if (shouldUnlock) {
          user.gamification.badges.push(badge.id);
          newBadges.push(badge);
        }
      }
    });
    await user.save();
    res.json({
      success: true,
      data: { totalPoints: user.gamification.totalPoints, level: user.gamification.level, gamesPlayed: user.gamification.gamesPlayed, newBadges }
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    console.log('LEADERBOARD REQUEST RECEIVED');
    const users = await User.find({ 'gamification.totalPoints': { $gt: 0 } }).select('username profile gamification').sort({ 'gamification.totalPoints': -1 }).limit(100);
    console.log('USERS FOUND:', users.length);
    const leaderboard = users.map(user => ({
      _id: user._id,
      username: user.username,
      profile: user.profile,
      totalPoints: user.gamification?.totalPoints || 0,
      level: user.gamification?.level || 1
    }));
    console.log('SENDING LEADERBOARD:', JSON.stringify({ success: true, data: { leaderboard } }));
    res.json({ success: true, data: { leaderboard } });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;