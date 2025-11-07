import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameCard = ({ game, progress }) => {
  const navigate = useNavigate();
  
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const handlePlay = () => {
    const routeMap = {
      'food_sorting': '/games/food-sorting',
      'meal_creator': '/games/meal-creator',
      'nutrition_quiz': '/games/nutrition-quiz'
    };
    navigate(routeMap[game.id]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 text-center">
        <span className="text-6xl">{game.icon}</span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{game.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[game.difficulty]}`}>
            {game.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            ⏱️ {game.estimatedTime} min
          </span>
        </div>
        
        {progress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${progress.completionPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        <button
          onClick={handlePlay}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 group-hover:scale-105"
        >
          {progress?.status === 'completed' ? 'Play Again' : 'Start Playing'}
        </button>
        
        {progress && (
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>High Score: {progress.highScore}</span>
            <span>Attempts: {progress.attempts}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;