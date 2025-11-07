import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const CalorieCounter = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const questions = [
    {
      food: '🍎 Medium Apple',
      calories: 95,
      options: [52, 95, 150, 200]
    },
    {
      food: '🍕 Slice of Pizza',
      calories: 285,
      options: [150, 285, 350, 450]
    },
    {
      food: '🍌 Banana',
      calories: 105,
      options: [75, 105, 130, 160]
    },
    {
      food: '🥤 Can of Soda',
      calories: 140,
      options: [80, 110, 140, 180]
    },
    {
      food: '🥗 Caesar Salad',
      calories: 470,
      options: [250, 350, 470, 600]
    }
  ];

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

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(300);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === questions[currentQuestion].calories) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleGameOver();
      }
    }, 1500);
  };

  const handleGameOver = async () => {
    setGameOver(true);
    
    const finalScore = score * 20; // 20 points per correct answer

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
          points: finalScore, 
          gameId: 'calorie-counter',
          perfectScore: score === questions.length
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
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(300);
  };

  const isCorrect = selectedAnswer === questions[currentQuestion]?.calories;

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
            <div className="text-8xl mb-4">🔢</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Calorie Counter Challenge</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Estimate the calories in each food item!
            </p>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">How to Play:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• Guess the correct calorie count for each food</li>
              <li>• You have 5 minutes to complete all questions</li>
              <li>• Each correct answer earns you 20 points</li>
              <li>• Learn the actual calorie values as you play!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
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
              {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🌟' : '🎯'}
            </div>
            <h2 className="text-4xl font-bold text-readable mb-4">Game Complete!</h2>
            <div className="glass-card p-6 mb-6 max-w-md mx-auto">
              <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Final Score</p>
              <p className="text-5xl font-bold text-primary">{score * 20}</p>
            </div>
            <p className="text-2xl text-accent font-bold mb-8">
              You got {score} out of {questions.length} correct!
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
          <h1 className="text-4xl font-bold text-readable mb-2">
            🔢 Calorie Counter Challenge
          </h1>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            Estimate the calories in each food item!
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-readable font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏱️</span>
            <span className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-readable'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-primary font-bold text-lg">
            Score: {score}/{questions.length}
          </span>
        </div>

        <div className="glass-card p-8 mb-8 text-center">
          <div className="text-8xl mb-4">{questions[currentQuestion].food.split(' ')[0]}</div>
          <h2 className="text-2xl font-bold text-readable mb-2">
            {questions[currentQuestion].food}
          </h2>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            How many calories does this have?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
              className={`p-6 rounded-xl font-bold text-xl transition-all duration-300 ${
                showResult
                  ? option === questions[currentQuestion].calories
                    ? 'bg-green-500 text-white ring-4 ring-green-300'
                    : option === selectedAnswer
                    ? 'bg-red-500 text-white ring-4 ring-red-300'
                    : 'glass-strong text-readable opacity-50'
                  : 'glass-strong text-readable hover:scale-105 hover:bg-primary hover:text-white'
              }`}
            >
              {option} calories
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`mt-6 p-6 rounded-xl text-center ${isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircleIcon className="w-8 h-8" />
                <span className="text-xl font-bold">Correct! Great job!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
                <XCircleIcon className="w-8 h-8" />
                <span className="text-xl font-bold">
                  Not quite! It's {questions[currentQuestion].calories} calories.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCounter;