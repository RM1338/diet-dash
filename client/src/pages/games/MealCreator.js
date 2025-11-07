import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const MealCreator = () => {
  const navigate = useNavigate();
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState(null);

  const gameData = {
    targetCalories: { min: 400, max: 600 },
    targetMacros: {
      protein: { min: 20, max: 35 },
      carbs: { min: 40, max: 55 },
      fats: { min: 20, max: 35 }
    },
    foodItems: [
      { id: 1, name: 'Grilled Chicken', image: '🍗', calories: 165, protein: 60, carbs: 0, fats: 40 },
      { id: 2, name: 'Brown Rice', image: '🍚', calories: 215, protein: 10, carbs: 80, fats: 10 },
      { id: 3, name: 'Broccoli', image: '🥦', calories: 55, protein: 30, carbs: 60, fats: 10 },
      { id: 4, name: 'Salmon', image: '🐟', calories: 206, protein: 50, carbs: 0, fats: 50 },
      { id: 5, name: 'Sweet Potato', image: '🍠', calories: 112, protein: 5, carbs: 90, fats: 5 },
      { id: 6, name: 'Avocado', image: '🥑', calories: 160, protein: 5, carbs: 20, fats: 75 },
      { id: 7, name: 'Eggs', image: '🥚', calories: 155, protein: 35, carbs: 5, fats: 60 },
      { id: 8, name: 'Quinoa', image: '🌾', calories: 120, protein: 15, carbs: 70, fats: 15 },
      { id: 9, name: 'Spinach', image: '🥬', calories: 23, protein: 40, carbs: 50, fats: 10 },
      { id: 10, name: 'Almonds', image: '🥜', calories: 164, protein: 15, carbs: 15, fats: 70 },
      { id: 11, name: 'Greek Yogurt', image: '🥛', calories: 100, protein: 50, carbs: 40, fats: 10 },
      { id: 12, name: 'Banana', image: '🍌', calories: 105, protein: 5, carbs: 90, fats: 5 }
    ]
  };

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameFinished) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameFinished]);

  const startGame = () => {
    setGameStarted(true);
    setSelectedItems([]);
    setGameFinished(false);
    setResults(null);
    setTimeLeft(300);
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    selectedItems.forEach(item => {
      totalCalories += item.calories;
      totalProtein += (item.calories * item.protein) / 100;
      totalCarbs += (item.calories * item.carbs) / 100;
      totalFats += (item.calories * item.fats) / 100;
    });

    const totalMacros = totalProtein + totalCarbs + totalFats;

    return {
      calories: totalCalories,
      protein: totalMacros > 0 ? (totalProtein / totalMacros) * 100 : 0,
      carbs: totalMacros > 0 ? (totalCarbs / totalMacros) * 100 : 0,
      fats: totalMacros > 0 ? (totalFats / totalMacros) * 100 : 0
    };
  };

  const calculateScore = (nutrition) => {
    const { calories, protein, carbs, fats } = nutrition;
    const { targetCalories, targetMacros } = gameData;

    const caloriesInRange = calories >= targetCalories.min && calories <= targetCalories.max;
    
    const proteinDiff = Math.abs(protein - ((targetMacros.protein.min + targetMacros.protein.max) / 2));
    const carbsDiff = Math.abs(carbs - ((targetMacros.carbs.min + targetMacros.carbs.max) / 2));
    const fatsDiff = Math.abs(fats - ((targetMacros.fats.min + targetMacros.fats.max) / 2));
    
    const macroAccuracy = 100 - ((proteinDiff + carbsDiff + fatsDiff) / 3);
    
    let score = 0;
    
    if (caloriesInRange) score += 40;
    score += Math.max(0, macroAccuracy * 0.6);
    
    return Math.round(score);
  };

  const toggleItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id);
    
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = async () => {
    setGameFinished(true);
    
    const nutrition = calculateNutrition();
    const score = calculateScore(nutrition);

    setResults({
      score,
      nutrition
    });

    // Award points to backend
    try {
      const token = localStorage.getItem('token');
      const { calories } = nutrition;
      const { targetCalories } = gameData;
      const calorieAccuracy = Math.abs(calories - ((targetCalories.min + targetCalories.max) / 2));
      const perfectScore = score >= 90 && selectedItems.length >= 4;
      
      const response = await fetch('http://localhost:5000/api/gamification/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          points: score, 
          gameId: 'meal-creator',
          perfectScore
        })
      });
      
      const data = await response.json();
      console.log('Points awarded:', data);
      
      if (data.data?.newBadges && data.data.newBadges.length > 0) {
        const badgesList = data.data.newBadges.map(b => `${b.icon} ${b.name}`).join('<br/>');
        
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px 40px; border-radius: 20px; 
                      box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 10000; 
                      text-align: center; font-family: system-ui; max-width: 400px;">
            <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #fff;">New Badge Unlocked!</div>
            <div style="font-size: 18px; margin-bottom: 20px; color: #fff;">${badgesList}</div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: white; color: #667eea; border: none; 
                           padding: 12px 30px; border-radius: 10px; font-size: 16px; 
                           font-weight: bold; cursor: pointer;">
              Awesome!
            </button>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const resetGame = () => {
    setSelectedItems([]);
    setGameStarted(false);
    setGameFinished(false);
    setResults(null);
    setTimeLeft(300);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
        <div className="glass-card p-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Games
          </button>

          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🍽️</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Balanced Meal Creator</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Select food items to create a nutritionally balanced meal!
            </p>
          </div>

          <div className="glass-card p-6 mb-6">
            <h2 className="text-xl font-bold text-readable mb-4">Your Goals:</h2>
            <div className="grid grid-cols-2 gap-4 text-readable">
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Calories:</p>
                <p className="text-lg font-bold">{gameData.targetCalories.min} - {gameData.targetCalories.max}</p>
              </div>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Macronutrients:</p>
                <ul className="text-sm">
                  <li>Protein: {gameData.targetMacros.protein.min}-{gameData.targetMacros.protein.max}%</li>
                  <li>Carbs: {gameData.targetMacros.carbs.min}-{gameData.targetMacros.carbs.max}%</li>
                  <li>Fats: {gameData.targetMacros.fats.min}-{gameData.targetMacros.fats.max}%</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">How to Play:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• Select food items to create a balanced meal</li>
              <li>• You have 5 minutes to complete</li>
              <li>• Try to meet the calorie and macronutrient targets</li>
              <li>• Higher accuracy = better score!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Creating
          </button>
        </div>
      </div>
    );
  }

  if (gameFinished && results) {
    const { score, nutrition } = results;
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
        <div className="glass-card p-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Games
          </button>

          <div className="text-center py-12">
            <div className="text-8xl mb-6">
              {score >= 80 ? '🌟' : score >= 60 ? '👍' : score >= 40 ? '💪' : '🎯'}
            </div>
            
            <h1 className="text-4xl font-bold text-readable mb-4">Meal Complete!</h1>
            
            <div className="glass-card p-6 mb-6 max-w-md mx-auto">
              <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Balance Score</p>
              <p className="text-5xl font-bold text-primary">{score}/100</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-xs text-readable mb-1" style={{ color: 'var(--color-text-secondary)' }}>Calories</p>
                <p className="text-xl font-bold text-readable">{Math.round(nutrition.calories)}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Protein</p>
                <p className="text-xl font-bold text-blue-600">{Math.round(nutrition.protein)}%</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Carbs</p>
                <p className="text-xl font-bold text-yellow-600">{Math.round(nutrition.carbs)}%</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>Fats</p>
                <p className="text-xl font-bold text-orange-600">{Math.round(nutrition.fats)}%</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                Create Another Meal
              </button>
              <button
                onClick={() => navigate('/games')}
                className="px-8 py-4 glass-strong text-readable rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentNutrition = calculateNutrition();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
      <div className="glass-card p-8">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-primary hover:text-accent mb-6 font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Games
        </button>

        {/* Timer */}
        <div className="glass-card p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏱️</span>
            <span className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-readable'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-readable">
            {selectedItems.length} items selected
          </span>
        </div>

        {/* Nutrition Display */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold text-readable mb-4">Your Meal Nutrition</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-readable mb-1" style={{ color: 'var(--color-text-secondary)' }}>Calories</p>
              <p className={`text-2xl font-bold ${
                currentNutrition.calories >= gameData.targetCalories.min && 
                currentNutrition.calories <= gameData.targetCalories.max 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.round(currentNutrition.calories)}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Target: {gameData.targetCalories.min}-{gameData.targetCalories.max}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-readable mb-1" style={{ color: 'var(--color-text-secondary)' }}>Protein</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(currentNutrition.protein)}%
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Target: {gameData.targetMacros.protein.min}-{gameData.targetMacros.protein.max}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-readable mb-1" style={{ color: 'var(--color-text-secondary)' }}>Carbs</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Math.round(currentNutrition.carbs)}%
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Target: {gameData.targetMacros.carbs.min}-{gameData.targetMacros.carbs.max}%
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-readable mb-1" style={{ color: 'var(--color-text-secondary)' }}>Fats</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(currentNutrition.fats)}%
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Target: {gameData.targetMacros.fats.min}-{gameData.targetMacros.fats.max}%
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedItems.length === 0}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300"
          >
            Submit Meal
          </button>
        </div>

        {/* Food Selection */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-readable mb-6">Available Food Items</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gameData.foodItems.map((item) => {
              const isSelected = selectedItems.find(i => i.id === item.id);
              
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`cursor-pointer rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-xl'
                      : 'glass hover:bg-surface border-2 border-border'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-4xl block mb-2">{item.image}</span>
                    <p className={`font-bold text-sm mb-2 ${isSelected ? 'text-white' : 'text-readable'}`}>
                      {item.name}
                    </p>
                    <div className={`text-xs space-y-1 ${isSelected ? 'text-white/90' : 'text-readable'}`} style={!isSelected ? { color: 'var(--color-text-secondary)' } : {}}>
                      <p>{item.calories} cal</p>
                      <p className="text-xs">
                        P:{item.protein}% C:{item.carbs}% F:{item.fats}%
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-white text-xl">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCreator;