import React from 'react';

const BadgeCard = ({ badge, earned = false }) => {
  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
      earned 
        ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-accent shadow-lg scale-105' 
        : 'bg-gray-100 border-gray-300 opacity-60'
    }`}>
      <div className="text-center">
        <div className="text-5xl mb-2">{badge.icon}</div>
        <h3 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
        
        <div className="flex justify-between items-center text-xs">
          <span className={`px-2 py-1 rounded-full ${
            badge.rarity === 'legendary' ? 'bg-yellow-400 text-yellow-900' :
            badge.rarity === 'epic' ? 'bg-purple-400 text-purple-900' :
            badge.rarity === 'rare' ? 'bg-blue-400 text-blue-900' :
            'bg-gray-400 text-gray-900'
          }`}>
            {badge.rarity}
          </span>
          {!earned && (
            <span className="text-gray-500">
              {badge.pointsRequired} pts
            </span>
          )}
        </div>
      </div>
      
      {earned && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
          ✓
        </div>
      )}
    </div>
  );
};

export default BadgeCard;