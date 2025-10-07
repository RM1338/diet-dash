const Game = require('../models/Game');
const GameScore = require('../models/GameScore');
const Progress = require('../models/Progress');
const Badge = require('../models/Badge');
const User = require('../models/User');

// Get all games list with user progress
exports.getGamesList = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Get all games
    const games = await Game.find();

    // Get user's progress for each game
    const gamesWithProgress = await Promise.all(
      games.map(async (game) => {
        const progress = await Progress.findOne({
          userId,
          gameId: game._id
        });

        return {
          _id: game._id,
          title: game.title,
          description: game.description,
          difficulty: game.difficulty,
          estimatedTime: game.estimatedTime,
          icon: game.icon,
          route: game.route,
          category: game.category,
          points: game.points,
          progress: progress ? {
            completionPercentage: progress.completionPercentage,
            highScore: progress.highScore,
            attempts: progress.attempts
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: gamesWithProgress
    });
  } catch (error) {
    console.error('Error fetching games list:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching games list',
      error: error.message
    });
  }
};

// Submit game score and update progress
exports.submitGameScore = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, score, correctAnswers, totalQuestions, timeTaken, gameData } = req.body;

    // Find the game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Save game score
    const gameScore = await GameScore.create({
      userId,
      gameId,
      score,
      correctAnswers,
      totalQuestions,
      timeTaken,
      gameData
    });

    // Update or create progress
    let progress = await Progress.findOne({ userId, gameId });

    if (progress) {
      // Update existing progress
      progress.attempts += 1;
      progress.highScore = Math.max(progress.highScore, score);
      progress.lastPlayedAt = Date.now();
      
      // Calculate completion percentage based on performance
      const accuracy = (correctAnswers / totalQuestions) * 100;
      progress.completionPercentage = Math.max(
        progress.completionPercentage,
        Math.round(accuracy)
      );
    } else {
      // Create new progress
      const accuracy = (correctAnswers / totalQuestions) * 100;
      progress = await Progress.create({
        userId,
        gameId,
        attempts: 1,
        highScore: score,
        completionPercentage: Math.round(accuracy),
        lastPlayedAt: Date.now()
      });
    }

    await progress.save();

    // Update user points and level
    const user = await User.findById(userId);
    if (user) {
      user.gamification.totalPoints += score;
      user.gamification.gamesPlayed += 1;
      
      // Calculate level (100 points per level)
      const newLevel = Math.floor(user.gamification.totalPoints / 100) + 1;
      user.gamification.level = newLevel;
      
      await user.save();

      // Check for badge unlocks
      await checkBadgeUnlocks(userId, user.gamification.totalPoints, user.gamification.gamesPlayed);
    }

    res.status(201).json({
      success: true,
      data: {
        gameScore,
        progress,
        newPoints: user.gamification.totalPoints,
        newLevel: user.gamification.level
      },
      message: 'Score submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting game score:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting game score',
      error: error.message
    });
  }
};

// Check and unlock badges
const checkBadgeUnlocks = async (userId, totalPoints, gamesPlayed) => {
  try {
    const badges = await Badge.find();
    const user = await User.findById(userId);

    for (const badge of badges) {
      // Check if badge is already unlocked
      const alreadyUnlocked = user.gamification.unlockedBadges.includes(badge._id);
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      // Check criteria
      switch (badge.criteria.type) {
        case 'points':
          shouldUnlock = totalPoints >= badge.criteria.value;
          break;
        case 'games':
          shouldUnlock = gamesPlayed >= badge.criteria.value;
          break;
        case 'streak':
          // Implement streak logic if needed
          break;
        case 'perfect':
          // Implement perfect score logic if needed
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        user.gamification.unlockedBadges.push(badge._id);
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error checking badge unlocks:', error);
  }
};

// Get user's game history
exports.getGameHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await GameScore.find({ userId })
      .populate('gameId', 'title icon')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching game history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game history',
      error: error.message
    });
  }
};

// Get overall leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('username profile gamification')
      .sort({ 'gamification.totalPoints': -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.profile.avatar,
      totalPoints: user.gamification.totalPoints,
      level: user.gamification.level,
      gamesPlayed: user.gamification.gamesPlayed
    }));

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// Get game-specific leaderboard
exports.getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    const topScores = await GameScore.find({ gameId })
      .populate('userId', 'username profile')
      .sort({ score: -1 })
      .limit(10);

    const leaderboard = topScores.map((score, index) => ({
      rank: index + 1,
      userId: score.userId._id,
      username: score.userId.username,
      avatar: score.userId.profile.avatar,
      score: score.score,
      correctAnswers: score.correctAnswers,
      totalQuestions: score.totalQuestions,
      timeTaken: score.timeTaken,
      playedAt: score.createdAt
    }));

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching game leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game leaderboard',
      error: error.message
    });
  }
};

module.exports = exports;