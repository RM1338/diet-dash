import React, { useState, useEffect } from 'react';
import { gamificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { TrophyIcon } from '@heroicons/react/24/solid';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = filter !== 'overall' ? { gameType: filter } : {};
      const response = await gamificationAPI.getLeaderboard(params);
      
      // Axios returns response.data, backend returns { success, data: { leaderboard } }
      // So we access response.data.data.leaderboard OR response.data.leaderboard
      const leaderboardData = response.data?.data?.leaderboard || response.data?.leaderboard || [];
      
      if (Array.isArray(leaderboardData)) {
        setLeaderboard(leaderboardData);
      } else {
        console.warn('Invalid leaderboard data format:', response);
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
          <span className="relative z-10 text-white font-bold text-lg">1</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
          <span className="relative z-10 text-white font-bold text-lg">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
          <span className="relative z-10 text-white font-bold text-lg">3</span>
        </div>
      );
    }
    return <span className="text-xl font-bold text-readable">{rank}</span>;
  };

  const gameFilters = [
    { value: 'overall', label: 'Overall', icon: '' },
    { value: 'food_sorting', label: 'Food Sorting', icon: '🥗' },
    { value: 'meal_creator', label: 'Meal Creator', icon: '🍽️' },
    { value: 'nutrition_quiz', label: 'Nutrition Quiz', icon: '🧠' },
    { value: 'calorie_counter', label: 'Calorie Counter', icon: '🔢' },
    { value: 'vitamin_match', label: 'Vitamin Match', icon: '💊' },
    { value: 'shopping_spree', label: 'Shopping Spree', icon: '🛒' },
    { value: 'nutrition_recipe_creator', label: 'Recipe Creator', icon: '👨‍🍳' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-content">
      {/* Header - Simple Style */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrophyIcon className="w-10 h-10 text-accent" />
          <h1 className="text-4xl font-bold text-readable">Leaderboard</h1>
        </div>
        <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
          See how you rank against other learners
        </p>
      </div>

      {/* Filter Tabs - Scrollable with visible overflow */}
      <div className="mb-8 stagger-item">
        <div className="glass-card p-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
            {gameFilters.map((gameFilter) => (
              <button
                key={gameFilter.value}
                onClick={() => setFilter(gameFilter.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  filter === gameFilter.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-readable hover:bg-surface'
                }`}
              >
                {gameFilter.icon && <span className="mr-2">{gameFilter.icon}</span>}
                {gameFilter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-2xl font-bold text-primary">Loading leaderboard...</div>
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="glass-card p-12 text-center stagger-item">
          <div className="flex justify-center mb-4">
            <TrophyIcon className="w-24 h-24 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-readable mb-3">No Rankings Yet</h2>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            Be the first to play and claim the top spot!
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden stagger-item">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-bold text-readable">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-readable">Player</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-readable">Level</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-readable">
                    {filter === 'overall' ? 'Total Points' : 'Score'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => {
                  const rank = index + 1;
                  const isCurrentUser = filter === 'overall' 
                    ? player._id === user._id 
                    : player.userId?._id === user._id;
                  
                  return (
                    <tr
                      key={player._id}
                      className={`border-b border-border transition-all duration-300 ${
                        isCurrentUser 
                          ? 'bg-primary bg-opacity-10 hover:bg-opacity-20' 
                          : 'hover:bg-surface'
                      }`}
                    >
                      <td className="px-6 py-4">
                        {getRankBadge(rank)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {filter === 'overall' 
                              ? player.profile?.avatar || '🧑'
                              : player.userId?.profile?.avatar || '🧑'}
                          </span>
                          <div>
                            <p className="font-bold text-readable">
                              {filter === 'overall' ? player.username : player.userId?.username}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-white font-bold text-lg shadow-md">
                          {filter === 'overall' ? player.level : player.userId?.gamification?.level || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-2xl font-bold text-readable">
                          {filter === 'overall' ? player.totalPoints : player.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;