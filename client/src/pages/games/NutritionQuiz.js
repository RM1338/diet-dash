import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const NutritionQuiz = () => {
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(240);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const gameData = {
    questions: [
      {
        question: "Which vitamin is primarily obtained from sunlight?",
        options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
        correctAnswer: 2,
        explanation: "Vitamin D is synthesized in the skin when exposed to sunlight. It's essential for calcium absorption and bone health."
      },
      {
        question: "What is the recommended daily water intake for adults?",
        options: ["4 cups", "8 cups", "12 cups", "16 cups"],
        correctAnswer: 1,
        explanation: "The general recommendation is about 8 cups (64 ounces) of water per day, though individual needs may vary based on activity level and climate."
      },
      {
        question: "Which nutrient is the body's primary source of energy?",
        options: ["Proteins", "Carbohydrates", "Fats", "Vitamins"],
        correctAnswer: 1,
        explanation: "Carbohydrates are the body's main source of energy. They are broken down into glucose, which cells use for fuel."
      },
      {
        question: "Which of these foods is highest in protein?",
        options: ["Apple", "Chicken breast", "White bread", "Lettuce"],
        correctAnswer: 1,
        explanation: "Chicken breast is an excellent source of lean protein, containing about 31 grams of protein per 100 grams."
      },
      {
        question: "What mineral is essential for healthy red blood cells?",
        options: ["Calcium", "Iron", "Potassium", "Zinc"],
        correctAnswer: 1,
        explanation: "Iron is crucial for producing hemoglobin, the protein in red blood cells that carries oxygen throughout the body."
      },
      {
        question: "Which type of fat is considered healthiest?",
        options: ["Trans fats", "Saturated fats", "Unsaturated fats", "All fats are equal"],
        correctAnswer: 2,
        explanation: "Unsaturated fats, found in foods like olive oil, avocados, and nuts, are considered the healthiest type of dietary fat."
      },
      {
        question: "How many calories are in one gram of protein?",
        options: ["2 calories", "4 calories", "7 calories", "9 calories"],
        correctAnswer: 1,
        explanation: "Protein contains 4 calories per gram, the same as carbohydrates. Fat contains 9 calories per gram."
      },
      {
        question: "Which vitamin is important for blood clotting?",
        options: ["Vitamin A", "Vitamin B12", "Vitamin K", "Vitamin C"],
        correctAnswer: 2,
        explanation: "Vitamin K plays a crucial role in blood clotting and bone metabolism. It's found in leafy greens and fermented foods."
      }
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
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setGameFinished(false);
    setResults(null);
    setTimeLeft(240);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < gameData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = async () => {
    setGameFinished(true);
    
    let correctAnswers = 0;
    let score = 0;

    gameData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
        score += 15;
      }
    });

    setResults({
      score,
      correctAnswers,
      totalQuestions: gameData.questions.length
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
          gameId: 'nutrition-quiz',
          perfectScore: correctAnswers === gameData.questions.length
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
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setGameStarted(false);
    setGameFinished(false);
    setResults(null);
    setTimeLeft(240);
    setShowExplanation(false);
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
            <div className="text-8xl mb-4">🧠</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Nutrition Knowledge Quiz</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Test your knowledge about healthy eating and nutrition!
            </p>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">Quiz Information:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• {gameData.questions.length} multiple-choice questions</li>
              <li>• 4 minutes time limit</li>
              <li>• 15 points per correct answer</li>
              <li>• Review explanations after each answer</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Quiz
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
              {results.correctAnswers === results.totalQuestions ? '🏆' : 
               results.correctAnswers >= results.totalQuestions * 0.8 ? '🌟' : 
               results.correctAnswers >= results.totalQuestions * 0.6 ? '👍' : '📚'}
            </div>
            
            <h1 className="text-4xl font-bold text-readable mb-4">Quiz Complete!</h1>
            
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="glass-card p-6">
                <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Score</p>
                <p className="text-4xl font-bold text-primary">{results.score}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Correct</p>
                <p className="text-4xl font-bold text-accent">
                  {results.correctAnswers}/{results.totalQuestions}
                </p>
              </div>
              <div className="glass-card p-6">
                <p className="text-readable mb-2" style={{ color: 'var(--color-text-secondary)' }}>Accuracy</p>
                <p className="text-4xl font-bold text-secondary">
                  {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                Take Quiz Again
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

  const question = gameData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / gameData.questions.length) * 100;

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

        {/* Header */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">⏱️</span>
              <span className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-readable'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-lg font-medium text-readable">
              Question {currentQuestion + 1} of {gameData.questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-readable mb-8">
            {question.question}
          </h2>

          <div className="space-y-4 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showExplanation && isCorrect;
              const showIncorrect = showExplanation && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    showCorrect
                      ? 'bg-green-500 border-green-500 text-white'
                      : showIncorrect
                      ? 'bg-red-500 border-red-500 text-white'
                      : isSelected
                      ? 'bg-primary border-primary text-white shadow-lg transform scale-105'
                      : 'glass border-border hover:border-primary hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      showCorrect || showIncorrect
                        ? 'bg-white text-gray-800'
                        : isSelected 
                        ? 'bg-white text-primary' 
                        : 'bg-gray-200 dark:bg-gray-700 text-readable'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`font-medium ${
                      showCorrect || showIncorrect || isSelected ? 'text-white' : 'text-readable'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswers[currentQuestion] !== undefined && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-primary hover:text-accent font-semibold mb-4 flex items-center gap-2"
            >
              {showExplanation ? '▼' : '▶'} {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
          )}

          {showExplanation && (
            <div className={`glass-card p-6 mb-6 border-2 ${
              selectedAnswers[currentQuestion] === question.correctAnswer
                ? 'border-green-500 bg-green-500 bg-opacity-10'
                : 'border-red-500 bg-red-500 bg-opacity-10'
            }`}>
              <div className="flex items-start gap-3">
                {selectedAnswers[currentQuestion] === question.correctAnswer ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className={`font-bold mb-2 ${
                    selectedAnswers[currentQuestion] === question.correctAnswer
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {selectedAnswers[currentQuestion] === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
                    ✓ Correct Answer: {String.fromCharCode(65 + question.correctAnswer)}
                  </p>
                  <p className="text-readable mt-2">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 glass-strong text-readable font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              ← Previous
            </button>

            <div className="text-sm text-readable">
              {Object.keys(selectedAnswers).length} / {gameData.questions.length} answered
            </div>

            {currentQuestion < gameData.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== gameData.questions.length}
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionQuiz;