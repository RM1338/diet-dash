import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gamificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon, TrophyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation(); // Track navigation changes
  
  // Static games data - ALL 7 GAMES
  const [games] = useState([
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
  ]);
  
  const [badges, setBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]); // Store ALL badges
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  // FIXED: Refetch every time component mounts or location changes
  useEffect(() => {
    if (user && user._id) {
      console.log('Dashboard mounted - fetching fresh data');
      fetchDashboardData();
    }
  }, [user, location.pathname]); // Added location.pathname to refetch on navigation

  // Auto-play carousel - changes every 4 seconds
  useEffect(() => {
    if (games.length > 1) {
      const interval = setInterval(() => {
        setCurrentGameIndex((prev) => (prev + 1) % games.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [games.length]);

  const fetchDashboardData = async () => {
    try {
      if (!user || !user._id) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      const userId = user._id;

      try {
        const badgesData = await gamificationAPI.getUserBadges(userId);
        if (badgesData.data && badgesData.data.data && Array.isArray(badgesData.data.data)) {
          const allBadgesArray = badgesData.data.data;
          setAllBadges(allBadgesArray); // Store all badges
          setBadges(allBadgesArray.slice(0, 3)); // Display first 3
          console.log('Badges fetched:', allBadgesArray.length, 'Unlocked:', allBadgesArray.filter(b => b.isUnlocked).length);
        } else {
          setAllBadges([]);
          setBadges([]);
        }
      } catch (badgeError) {
        console.error('Error fetching badges:', badgeError);
        setAllBadges([]);
        setBadges([]);
      }

      try {
        const progressData = await gamificationAPI.getUserProgress(userId);
        setProgress(progressData.data.data || null);
      } catch (progressError) {
        console.error('Error fetching progress:', progressError);
        setProgress(null);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const nextGame = () => {
    setCurrentGameIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setCurrentGameIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const goToGame = (index) => {
    setCurrentGameIndex(index);
  };

  // Get visible game indices (previous, current, next)
  const getVisibleGames = () => {
    if (games.length === 0) return [];
    if (games.length === 1) return [0];
    if (games.length === 2) return [0, 1];
    
    const prev = (currentGameIndex - 1 + games.length) % games.length;
    const next = (currentGameIndex + 1) % games.length;
    return [prev, currentGameIndex, next];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-readable">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
      {/* Welcome Section */}
      <div className="glass-card p-8 mb-8 stagger-item">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-readable mb-2">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              Ready to continue your nutrition learning journey?
            </p>
          </div>
          <div className="hidden md:block text-6xl">
            {user.profile?.avatar || '🧑'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 stagger-item">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-readable font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                Total Points
              </p>
              <p className="text-3xl font-bold text-primary mt-2">
                {user.gamification?.totalPoints || 0}
              </p>
            </div>
            <div className="text-yellow-500">
              <StarIcon className="w-12 h-12" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 stagger-item">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-readable font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                Current Level
              </p>
              <p className="text-3xl font-bold text-accent mt-2">
                Level {user.gamification?.level || 1}
              </p>
            </div>
            <div className="text-accent">
              <TrophyIcon className="w-12 h-12" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 stagger-item">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-readable font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                Badges Earned
              </p>
              <p className="text-3xl font-bold text-secondary mt-2">
                {allBadges.filter(b => b.isUnlocked).length}
              </p>
            </div>
            <div className="text-secondary">
              <ShieldCheckIcon className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-8 stagger-item">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-readable">Your Badges</h2>
          <Link 
            to="/profile" 
            className="text-primary hover:text-accent font-semibold transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.length > 0 ? (
            badges.map((badge, index) => (
              <div 
                key={badge._id || index} 
                className={`glass-card p-6 ${badge.isUnlocked ? '' : 'opacity-50'}`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold text-lg text-readable mb-2">
                    {badge.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {badge.description}
                  </p>
                  {badge.isUnlocked && (
                    <span className="inline-block mt-3 px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                      Unlocked ✓
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 glass-card p-8 text-center">
              <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
                No badges yet. Complete games to earn your first badge!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Games - Ultra-Smooth Overlapping Carousel */}
      <div className="stagger-item">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-readable">Available Games</h2>
          <Link 
            to="/games" 
            className="text-primary hover:text-accent font-semibold transition-colors"
          >
            View All →
          </Link>
        </div>

        {games.length > 0 ? (
          <div className="relative py-12">
            {/* Carousel Container with Ultra-Smooth Overlapping Cards */}
            <div className="flex items-center justify-center relative" style={{ height: '520px' }}>
              {getVisibleGames().map((gameIndex, position) => {
                const game = games[gameIndex];
                const isCurrent = gameIndex === currentGameIndex;
                const isLeft = position === 0;
                const isRight = position === 2;
                
                return (
                  <div
                    key={`${game._id}-${gameIndex}`}
                    className="absolute"
                    style={{
                      left: isCurrent ? '50%' : isLeft ? '8%' : '92%',
                      transform: isCurrent 
                        ? 'translateX(-50%) scale(1) translateY(0px)' 
                        : isLeft 
                          ? 'translateX(-15%) scale(0.85) translateY(20px)'
                          : 'translateX(-85%) scale(0.85) translateY(20px)',
                      zIndex: isCurrent ? 30 : 10,
                      opacity: isCurrent ? 1 : 0.4,
                      width: isCurrent ? '620px' : '420px',
                      maxWidth: '90vw',
                      filter: isCurrent ? 'none' : 'blur(3px) brightness(0.7)',
                      pointerEvents: isCurrent ? 'auto' : 'all',
                      transition: 'all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      willChange: 'transform, opacity, filter',
                    }}
                    onClick={() => !isCurrent && goToGame(gameIndex)}
                  >
                    <div className={`glass-card overflow-hidden h-full shadow-2xl ${!isCurrent && 'cursor-pointer hover:opacity-60 hover:scale-105'}`}
                      style={{ 
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      <div className="p-8">
                        <div 
                          className="text-center mb-4"
                          style={{
                            fontSize: isCurrent ? '5rem' : '3.5rem',
                            transition: 'font-size 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        >
                          {game.icon}
                        </div>
                        <h3 
                          className="font-bold text-readable text-center mb-3"
                          style={{
                            fontSize: isCurrent ? '2rem' : '1.5rem',
                            transition: 'font-size 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        >
                          {game.title}
                        </h3>
                        
                        {isCurrent && (
                          <div className="animate-fadeInSmooth">
                            <p className="text-base mb-6 text-center leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                              {game.description}
                            </p>
                            
                            <div className="flex items-center justify-center gap-4 mb-6">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(game.difficulty)}`}>
                                {game.difficulty}
                              </span>
                              <span className="text-base text-readable flex items-center">
                                <span className="mr-2">⏱️</span>
                                {game.estimatedTime}
                              </span>
                            </div>

                            {game.progress && (
                              <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                  <span style={{ color: 'var(--color-text-secondary)' }}>Progress</span>
                                  <span className="font-semibold text-primary">{game.progress.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                                    style={{ 
                                      width: `${game.progress.completionPercentage}%`,
                                      transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            <Link
                              to={game.route}
                              className="block w-full text-center bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                              style={{
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                              }}
                            >
                              {game.progress?.attempts > 0 ? 'Play Again' : 'Start Playing'}
                            </Link>

                            {game.progress && (
                              <div className="mt-4 flex justify-between text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                <span>High Score: <span className="font-bold text-primary">{game.progress.highScore}</span></span>
                                <span>Attempts: <span className="font-bold text-accent">{game.progress.attempts}</span></span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {games.length > 1 && (
              <>
                <button
                  onClick={prevGame}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass-strong p-4 rounded-full hover:scale-110 transition-all duration-300 z-40 group shadow-2xl"
                  aria-label="Previous game"
                >
                  <ChevronLeftIcon className="w-7 h-7 text-readable group-hover:text-primary transition-colors duration-300" />
                </button>
                
                <button
                  onClick={nextGame}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass-strong p-4 rounded-full hover:scale-110 transition-all duration-300 z-40 group shadow-2xl"
                  aria-label="Next game"
                >
                  <ChevronRightIcon className="w-7 h-7 text-readable group-hover:text-primary transition-colors duration-300" />
                </button>
              </>
            )}

            {/* Dots Navigation */}
            {games.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {games.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToGame(index)}
                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                      index === currentGameIndex
                        ? 'bg-primary w-10'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary hover:bg-opacity-50 w-2.5'
                    }`}
                    aria-label={`Go to game ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
              No games available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
