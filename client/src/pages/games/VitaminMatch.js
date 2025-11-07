import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const VitaminMatch = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [selectedVitamin, setSelectedVitamin] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const vitaminPairs = [
    { vitamin: 'Vitamin A', food: '🥕 Carrots', id: 1 },
    { vitamin: 'Vitamin C', food: '🍊 Oranges', id: 2 },
    { vitamin: 'Vitamin D', food: '☀️ Sunlight & Fish', id: 3 },
    { vitamin: 'Vitamin E', food: '🥜 Nuts', id: 4 },
    { vitamin: 'Vitamin K', food: '🥬 Leafy Greens', id: 5 }
  ];

  const [vitamins] = useState(vitaminPairs.map(pair => ({ name: pair.vitamin, id: pair.id })));
  const [foods] = useState(vitaminPairs.map(pair => ({ name: pair.food, id: pair.id })).sort(() => Math.random() - 0.5));

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameOver]);

  useEffect(() => {
    if (selectedVitamin && selectedFood) {
      if (selectedVitamin.id === selectedFood.id) {
        setMatchedPairs([...matchedPairs, selectedVitamin.id]);
        setScore(score + 20);
        setMatches(matches + 1);

        if (matches + 1 === vitaminPairs.length) {
          setTimeout(() => {
            handleGameOver();
          }, 500);
        }
      }
      setTimeout(() => {
        setSelectedVitamin(null);
        setSelectedFood(null);
      }, 1000);
    }
  }, [selectedVitamin, selectedFood]);

  const handleGameOver = async () => {
    setGameOver(true);
    
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
          gameId: 'vitamin-match',
          perfectScore: matches === vitaminPairs.length
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

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setMatches(0);
    setSelectedVitamin(null);
    setSelectedFood(null);
    setMatchedPairs([]);
    setGameOver(false);
    setTimeLeft(180);
  };

  const handleVitaminClick = (vitamin) => {
    if (!matchedPairs.includes(vitamin.id)) {
      setSelectedVitamin(vitamin);
    }
  };

  const handleFoodClick = (food) => {
    if (!matchedPairs.includes(food.id)) {
      setSelectedFood(food);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setMatches(0);
    setSelectedVitamin(null);
    setSelectedFood(null);
    setMatchedPairs([]);
    setGameOver(false);
    setTimeLeft(180);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
        <div className="glass-card p-8">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6 font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Games
          </button>

          <div className="text-center mb-8">
            <div className="text-8xl mb-4">💊</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Vitamin Match Game</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Match each vitamin with its food source!
            </p>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">How to Play:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• Click a vitamin, then click its matching food source</li>
              <li>• You have 3 minutes to match all pairs</li>
              <li>• Each correct match earns you 20 points</li>
              <li>• Learn about vitamins and their sources!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Matching
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
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
              {matches === vitaminPairs.length ? '🏆' : '⏰'}
            </div>
            <h2 className="text-4xl font-bold text-readable mb-4">
              {matches === vitaminPairs.length ? 'Perfect Match!' : 'Time Up!'}
            </h2>
            <div className="glass-card p-6 mb-6 max-w-md mx-auto">
              <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Final Score</p>
              <p className="text-5xl font-bold text-primary">{score}</p>
            </div>
            <p className="text-2xl text-accent font-bold mb-8">
              {matches}/{vitaminPairs.length} matches completed
            </p>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
      <div className="glass-card p-8">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-primary hover:text-accent mb-6 font-semibold transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Games
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-readable mb-2">
            💊 Vitamin Match Game
          </h1>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            Match each vitamin with its food source!
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏱️</span>
            <span className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-readable'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-primary font-bold text-2xl">
            Score: {score} | Matches: {matches}/{vitaminPairs.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Vitamins Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-readable text-center mb-4">Vitamins</h3>
            {vitamins.map((vitamin) => (
              <button
                key={vitamin.id}
                onClick={() => handleVitaminClick(vitamin)}
                disabled={matchedPairs.includes(vitamin.id)}
                className={`w-full p-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  matchedPairs.includes(vitamin.id)
                    ? 'bg-green-500 text-white opacity-50'
                    : selectedVitamin?.id === vitamin.id
                    ? 'bg-primary text-white ring-4 ring-primary scale-105'
                    : 'glass-strong text-readable hover:scale-105 hover:bg-surface'
                }`}
              >
                {vitamin.name}
              </button>
            ))}
          </div>

          {/* Foods Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-readable text-center mb-4">Food Sources</h3>
            {foods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleFoodClick(food)}
                disabled={matchedPairs.includes(food.id)}
                className={`w-full p-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  matchedPairs.includes(food.id)
                    ? 'bg-green-500 text-white opacity-50'
                    : selectedFood?.id === food.id
                    ? 'bg-accent text-white ring-4 ring-accent scale-105'
                    : 'glass-strong text-readable hover:scale-105 hover:bg-surface'
                }`}
              >
                {food.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitaminMatch;