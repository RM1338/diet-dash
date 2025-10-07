const Badge = require('../models/Badge');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Game = require('../models/Game');

// Get user's badges (unlocked and locked)
exports.getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user (don't populate yet, just get the IDs)
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all badges
    const allBadges = await Badge.find({ isActive: true });

    // Get unlocked badge IDs (safely)
    const unlockedBadgeIds = user.gamification?.unlockedBadges || [];

    // Map badges with unlock status
    const badgesWithStatus = allBadges.map(badge => {
      const isUnlocked = unlockedBadgeIds.some(
        unlockedId => unlockedId.toString() === badge._id.toString()
      );

      return {
        _id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        criteria: badge.criteria,
        isUnlocked
      };
    });

    res.status(200).json({
      success: true,
      data: badgesWithStatus
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user badges',
      error: error.message
    });
  }
};

// Get all available badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: badges
    });
  } catch (error) {
    console.error('Error fetching all badges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error.message
    });
  }
};

// Get user's overall progress
exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all games
    const totalGames = await Game.countDocuments({ isActive: true });

    // Get user's progress records
    const userProgress = await Progress.find({ userId }).populate('gameId');

    // Calculate completed games (games with >80% completion)
    const completedGames = userProgress.filter(p => p.completionPercentage >= 80).length;

    // Calculate average score
    const avgScore = userProgress.length > 0
      ? userProgress.reduce((sum, p) => sum + p.highScore, 0) / userProgress.length
      : 0;

    // Get unlocked badges count (safely)
    const unlockedBadgesCount = user.gamification?.unlockedBadges?.length || 0;
    const totalBadges = await Badge.countDocuments({ isActive: true });

    // Overall progress percentage
    const overallProgress = totalGames > 0
      ? Math.round((completedGames / totalGames) * 100)
      : 0;

    const progressData = {
      user: {
        id: user._id,
        username: user.username,
        avatar: user.profile?.avatar || '🧑',
        totalPoints: user.gamification?.totalPoints || 0,
        level: user.gamification?.level || 1,
        gamesPlayed: user.gamification?.gamesPlayed || 0
      },
      stats: {
        totalGames,
        completedGames,
        overallProgress,
        averageScore: Math.round(avgScore),
        unlockedBadges: unlockedBadgesCount,
        totalBadges,
        badgeProgress: totalBadges > 0 
          ? Math.round((unlockedBadgesCount / totalBadges) * 100) 
          : 0
      },
      streak: user.gamification?.streak || { current: 0, longest: 0 },
      recentGames: userProgress
        .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
        .slice(0, 5)
        .map(p => ({
          game: {
            id: p.gameId?._id,
            title: p.gameId?.title,
            icon: p.gameId?.icon
          },
          highScore: p.highScore,
          completionPercentage: p.completionPercentage,
          attempts: p.attempts,
          lastPlayedAt: p.lastPlayedAt
        }))
    };

    res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user progress',
      error: error.message
    });
  }
};

// Update user streak
exports.updateStreak = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize gamification if it doesn't exist
    if (!user.gamification) {
      user.gamification = {
        totalPoints: 0,
        level: 1,
        gamesPlayed: 0,
        unlockedBadges: [],
        streak: { current: 0, longest: 0 }
      };
    }

    // Initialize streak if it doesn't exist
    if (!user.gamification.streak) {
      user.gamification.streak = { current: 0, longest: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPlayed = user.gamification.streak.lastPlayedDate
      ? new Date(user.gamification.streak.lastPlayedDate)
      : null;

    if (lastPlayed) {
      lastPlayed.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));

      if (dayDiff === 0) {
        // Already played today
        return res.status(200).json({
          success: true,
          message: 'Streak already updated today',
          data: user.gamification.streak
        });
      } else if (dayDiff === 1) {
        // Consecutive day
        user.gamification.streak.current += 1;
        user.gamification.streak.longest = Math.max(
          user.gamification.streak.longest || 0,
          user.gamification.streak.current
        );
      } else {
        // Streak broken
        user.gamification.streak.current = 1;
      }
    } else {
      // First time playing
      user.gamification.streak.current = 1;
      user.gamification.streak.longest = 1;
    }

    user.gamification.streak.lastPlayedDate = today;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Streak updated successfully',
      data: user.gamification.streak
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating streak',
      error: error.message
    });
  }
};

module.exports = exports;