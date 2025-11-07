import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const FoodSorting = () => {
  const navigate = useNavigate();
  
  const [shuffledItems, setShuffledItems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const gameData = {
    categories: ['Fruits', 'Vegetables', 'Proteins', 'Grains', 'Dairy'],
    items: [
      { id: 1, name: 'Apple', image: '🍎', correctCategory: 'Fruits' },
      { id: 2, name: 'Banana', image: '🍌', correctCategory: 'Fruits' },
      { id: 3, name: 'Carrot', image: '🥕', correctCategory: 'Vegetables' },
      { id: 4, name: 'Broccoli', image: '🥦', correctCategory: 'Vegetables' },
      { id: 5, name: 'Chicken', image: '🍗', correctCategory: 'Proteins' },
      { id: 6, name: 'Fish', image: '🐟', correctCategory: 'Proteins' },
      { id: 7, name: 'Bread', image: '🍞', correctCategory: 'Grains' },
      { id: 8, name: 'Rice', image: '🍚', correctCategory: 'Grains' },
      { id: 9, name: 'Milk', image: '🥛', correctCategory: 'Dairy' },
      { id: 10, name: 'Cheese', image: '🧀', correctCategory: 'Dairy' },
      { id: 11, name: 'Orange', image: '🍊', correctCategory: 'Fruits' },
      { id: 12, name: 'Spinach', image: '🥬', correctCategory: 'Vegetables' }
    ]
  };

  useEffect(() => {
    const shuffled = [...gameData.items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, []);

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
    setUserAnswers({});
    setGameFinished(false);
    setResults(null);
    setTimeLeft(180);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (draggedItem) {
      setUserAnswers({
        ...userAnswers,
        [draggedItem.id]: category
      });
      setDraggedItem(null);
    }
  };

const handleSubmit = async () => {
  setGameFinished(true);
  
  let correctAnswers = 0;
  let score = 0;

  gameData.items.forEach((item) => {
    if (userAnswers[item.id] === item.correctCategory) {
      correctAnswers++;
      score += 10;
    }
  });

  setResults({
    score,
    correctAnswers,
    totalQuestions: gameData.items.length
  });

  // Award points to backend
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/gamification/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        points: score, 
        gameId: 'food-sorting',
        perfectScore: correctAnswers === gameData.items.length
      })
    });
    
    const data = await response.json();
    console.log('Points awarded:', data);
    
    if (data.data?.newBadges && data.data.newBadges.length > 0) {
      const badgesList = data.data.newBadges.map(b => `${b.icon} ${b.name}`).join('<br/>');
      
      // Create custom notification div
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
                         font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            Awesome!
          </button>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Auto remove after 5 seconds
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
    const shuffled = [...gameData.items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
    setUserAnswers({});
    setGameStarted(false);
    setGameFinished(false);
    setResults(null);
    setTimeLeft(180);
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
            <div className="text-8xl mb-4">🥗</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Food Group Sorting</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Drag and drop each food item into the correct nutritional category!
            </p>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">Game Rules:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• Drag and drop each food item into the correct category</li>
              <li>• You have 3 minutes to complete the game</li>
              <li>• Each correct answer earns you 10 points</li>
              <li>• Perfect score = bonus points!</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-readable mb-3">Categories:</h3>
            <div className="flex flex-wrap gap-3">
              {gameData.categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 glass rounded-xl text-readable font-semibold"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameFinished && results) {
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
              {results.correctAnswers === results.totalQuestions ? '🎉' : 
               results.correctAnswers >= results.totalQuestions * 0.8 ? '🌟' : 
               results.correctAnswers >= results.totalQuestions * 0.6 ? '👍' : '💪'}
            </div>
            
            <h1 className="text-4xl font-bold text-readable mb-4">Game Complete!</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              <div className="glass-card p-6">
                <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Score</p>
                <p className="text-4xl font-bold text-primary">{results.score}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Accuracy</p>
                <p className="text-4xl font-bold text-accent">
                  {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                Play Again
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

        {/* Timer and Progress */}
        <div className="glass-card p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏱️</span>
            <span className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-readable'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-readable">
              Progress: {Object.keys(userAnswers).length}/{gameData.items.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Food Items */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-readable mb-4">Food Items</h2>
            <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {shuffledItems.map((item) => (
                !userAnswers[item.id] && (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="glass p-4 rounded-xl cursor-move hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <span className="text-4xl block mb-2">{item.image}</span>
                      <p className="font-medium text-readable">{item.name}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-readable">Categories</h2>
            {gameData.categories.map((category) => (
              <div
                key={category}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
                className="glass-card p-4 min-h-[120px] border-2 border-dashed border-border hover:border-primary transition-all"
              >
                <h3 className="font-bold text-lg text-readable mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(userAnswers)
                    .filter(([_, cat]) => cat === category)
                    .map(([itemId]) => {
                      const item = gameData.items.find((i) => i.id === parseInt(itemId));
                      return (
                        <div
                          key={itemId}
                          className="glass px-3 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <span className="text-2xl">{item.image}</span>
                          <span className="text-sm font-medium text-readable">{item.name}</span>
                          <button
                            onClick={() => {
                              const newAnswers = { ...userAnswers };
                              delete newAnswers[itemId];
                              setUserAnswers(newAnswers);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
            
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length !== gameData.items.length}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-300"
            >
              Submit Answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSorting;