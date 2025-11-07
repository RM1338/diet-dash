import React from 'react';
import { Link } from 'react-router-dom';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid';

const GameList = () => {
  // Static games data - no need to fetch from API
  const games = [
    {
      _id: '1',
      title: 'Food Sorting',
      description: 'Sort foods into their correct nutritional groups and learn about food categories',
      icon: '🥗',
      difficulty: 'easy',
      estimatedTime: '5 min',
      route: '/games/food-sorting'
    },
    {
      _id: '2',
      title: 'Balanced Meal Creator',
      description: 'Create balanced meals with proper nutrition and meet calorie targets',
      icon: '🍽️',
      difficulty: 'medium',
      estimatedTime: '5 min',
      route: '/games/meal-creator'
    },
    {
      _id: '3',
      title: 'Nutrition Knowledge Quiz',
      description: 'Test your nutrition knowledge with challenging questions',
      icon: '🧠',
      difficulty: 'medium',
      estimatedTime: '4 min',
      route: '/games/nutrition-quiz'
    },
    {
      _id: '4',
      title: 'Calorie Counter Challenge',
      description: 'Estimate calories in different foods and improve your awareness',
      icon: '🔢',
      difficulty: 'hard',
      estimatedTime: '5 min',
      route: '/games/calorie-counter'
    },
    {
      _id: '5',
      title: 'Vitamin Match',
      description: 'Match vitamins with their food sources and learn about nutrients',
      icon: '💊',
      difficulty: 'easy',
      estimatedTime: '3 min',
      route: '/games/vitamin-match'
    },
    {
      _id: '6',
      title: 'Healthy Shopping Spree',
      description: 'Shop for healthy groceries within budget and make smart choices',
      icon: '🛒',
      difficulty: 'medium',
      estimatedTime: '7 min',
      route: '/games/shopping-spree'
    },
    {
      _id: '7',
      title: 'Nutrition Recipe Creator',
      description: 'Create healthy recipes with balanced ingredients and nutrition',
      icon: '👨‍🍳',
      difficulty: 'medium',
      estimatedTime: '8 min',
      route: '/games/nutrition-recipe-creator'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <PuzzlePieceIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-readable">Games</h1>
        </div>
        <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
          Learn about healthy eating through fun, interactive games!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div key={game._id || index} className="glass-card overflow-hidden stagger-item">
            <div className="p-6">
              <div className="text-6xl mb-4 text-center">{game.icon}</div>
              
              <h3 className="text-2xl font-bold text-readable mb-2 text-center">
                {game.title}
              </h3>
              
              <p className="text-sm mb-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                {game.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
                <span className="text-sm text-readable flex items-center">
                  <span className="mr-1">⏱️</span>
                  {game.estimatedTime}
                </span>
              </div>

              {game.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--color-text-secondary)' }}>Progress</span>
                    <span className="font-semibold text-primary">{game.progress.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${game.progress.completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                to={game.route}
                className="block w-full text-center bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                {game.progress?.attempts > 0 ? 'Play Again' : 'Start Playing'}
              </Link>

              {game.progress && (
                <div className="mt-3 flex justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>High Score: <span className="font-bold text-primary">{game.progress.highScore}</span></span>
                  <span>Attempts: <span className="font-bold text-accent">{game.progress.attempts}</span></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;