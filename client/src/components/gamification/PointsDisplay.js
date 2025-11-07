import React from 'react';

const PointsDisplay = ({ points, size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-green-400 text-white px-6 py-3 rounded-full shadow-lg">
      <span className="text-3xl">⭐</span>
      <span className={`font-bold ${sizeClasses[size]}`}>{points}</span>
      <span className="text-sm font-medium">Points</span>
    </div>
  );
};

export default PointsDisplay;