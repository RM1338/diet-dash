import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const ShoppingSpree = () => {
  const navigate = useNavigate();
  const [budget] = useState(50);
  const [cart, setCart] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes
  const [gameStarted, setGameStarted] = useState(false);

  const items = [
    { id: 1, name: 'Apples', price: 3, icon: '🍎', healthy: true },
    { id: 2, name: 'Whole Grain Bread', price: 4, icon: '🍞', healthy: true },
    { id: 3, name: 'Chicken Breast', price: 8, icon: '🍗', healthy: true },
    { id: 4, name: 'Broccoli', price: 3, icon: '🥦', healthy: true },
    { id: 5, name: 'Salmon', price: 12, icon: '🐟', healthy: true },
    { id: 6, name: 'Greek Yogurt', price: 5, icon: '🥛', healthy: true },
    { id: 7, name: 'Candy', price: 2, icon: '🍬', healthy: false },
    { id: 8, name: 'Soda', price: 3, icon: '🥤', healthy: false },
    { id: 9, name: 'Chips', price: 4, icon: '🍟', healthy: false },
    { id: 10, name: 'Cookies', price: 5, icon: '🍪', healthy: false },
    { id: 11, name: 'Brown Rice', price: 6, icon: '🍚', healthy: true },
    { id: 12, name: 'Eggs', price: 4, icon: '🥚', healthy: true }
  ];

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
      finishShopping();
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setCart([]);
    setGameOver(false);
    setTimeLeft(420);
  };

  const getTotalCost = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const getHealthyCount = () => {
    return cart.filter(item => item.healthy).length;
  };

  const addToCart = (item) => {
    if (getTotalCost() + item.price <= budget) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateScore = () => {
    const healthyItems = getHealthyCount();
    const unhealthyItems = cart.length - healthyItems;
    return Math.max(0, (healthyItems * 10) - (unhealthyItems * 5));
  };

  const finishShopping = async () => {
    setGameOver(true);
    
    const finalScore = calculateScore();
    const healthyItems = getHealthyCount();

    // Award points to backend
    try {
      const token = localStorage.getItem('token');
      const perfectScore = healthyItems === cart.length && cart.length >= 5;
      
      const response = await fetch('http://localhost:5000/api/gamification/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          points: finalScore, 
          gameId: 'shopping-spree',
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
    setGameStarted(false);
    setCart([]);
    setGameOver(false);
    setTimeLeft(420);
  };

  if (!gameStarted) {
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

          <div className="text-center mb-8">
            <div className="text-8xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-readable mb-4">Healthy Shopping Spree</h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Shop for healthy groceries within your budget!
            </p>
          </div>

          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-readable mb-4">How to Play:</h2>
            <ul className="space-y-2 text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• You have a $50 budget to spend</li>
              <li>• You have 7 minutes to shop</li>
              <li>• Choose healthy items for +10 points each</li>
              <li>• Unhealthy items will deduct -5 points each</li>
              <li>• Stay within budget and maximize your score!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl text-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
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

          <div className="text-center py-12">
            <div className="text-8xl mb-6">
              {getHealthyCount() === cart.length && cart.length > 0 ? '🏆' : '🛒'}
            </div>
            <h2 className="text-4xl font-bold text-readable mb-4">Shopping Complete!</h2>
            <div className="glass-card p-8 max-w-md mx-auto mb-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-readable">Items Purchased:</span>
                  <span className="font-bold text-primary">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-readable">Healthy Items:</span>
                  <span className="font-bold text-green-600">{getHealthyCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-readable">Unhealthy Items:</span>
                  <span className="font-bold text-red-600">{cart.length - getHealthyCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-readable">Total Spent:</span>
                  <span className="font-bold text-accent">${getTotalCost()}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-readable font-bold">Final Score:</span>
                    <span className="font-bold text-primary">{calculateScore()} points</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:scale-105 transition-transform duration-300"
              >
                Shop Again
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-readable mb-2">
            🛒 Healthy Shopping Spree
          </h1>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            Shop for healthy groceries within your budget!
          </p>
        </div>

        {/* Timer Bar */}
        <div className="glass-card p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏱️</span>
            <span className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-readable'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-readable font-semibold">
            {cart.length} items in cart
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shopping Items */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-readable mb-4">Store Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={getTotalCost() + item.price > budget}
                  className="glass-card p-4 text-center hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-readable mb-1">{item.name}</h3>
                  <p className="text-primary font-bold">${item.price}</p>
                  {item.healthy ? (
                    <span className="text-xs text-green-600 dark:text-green-400">✓ Healthy</span>
                  ) : (
                    <span className="text-xs text-red-600 dark:text-red-400">✗ Unhealthy</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCartIcon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-readable">Your Cart</h2>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-readable">Budget:</span>
                <span className="font-bold text-primary">${budget}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-readable">Spent:</span>
                <span className="font-bold text-accent">${getTotalCost()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-readable">Remaining:</span>
                <span className="font-bold text-secondary">${budget - getTotalCost()}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  Cart is empty
                </p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2 p-2 glass rounded-lg">
                    <span className="text-readable">
                      {item.icon} {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">${item.price}</span>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={finishShopping}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingSpree;