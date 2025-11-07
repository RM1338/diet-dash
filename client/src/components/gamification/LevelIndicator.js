import React from 'react';

const LevelIndicator = ({ level, points }) => {
  const nextLevelPoints = Math.pow(level, 2) * 100;
  const currentLevelPoints = Math.pow(level - 1, 2) * 100;
  const pointsInLevel = points - currentLevelPoints;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  const progress = (pointsInLevel / pointsNeeded) * 100;

  return (
    <div className="bg-gradient-to-br from-accent to-purple-600 text-white p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">Current Level</p>
          <p className="text-4xl font-bold">Level {level}</p>
        </div>
        <div className="text-6xl">🏆</div>
      </div>
      
      <div className="mb-2">
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      
      <p className="text-xs opacity-90">
        {pointsNeeded - pointsInLevel} XP to Level {level + 1}
      </p>
    </div>
  );
};

export default LevelIndicator;