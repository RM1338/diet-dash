const BADGES = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first game',
    icon: '🎯',
    criteria: { gamesPlayed: 1 }
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% accuracy in a game',
    icon: '💯',
    criteria: { perfectScore: true }
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Play 5 games',
    icon: '⚡',
    criteria: { gamesPlayed: 5 }
  },
  {
    id: 'dedicated',
    name: 'Dedicated Player',
    description: 'Play 10 games',
    icon: '🔥',
    criteria: { gamesPlayed: 10 }
  },
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 500 total points',
    icon: '💎',
    criteria: { totalPoints: 500 }
  },
  {
    id: 'nutrition_master',
    name: 'Nutrition Master',
    description: 'Earn 1000 total points',
    icon: '👑',
    criteria: { totalPoints: 1000 }
  },
  {
    id: 'level_up',
    name: 'Level Up',
    description: 'Reach Level 5',
    icon: '⭐',
    criteria: { level: 5 }
  }
];

module.exports = BADGES;