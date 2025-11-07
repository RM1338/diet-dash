import React from 'react';

const ProgressBar = ({ current, total, label, color = 'primary' }) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    blue: 'bg-blue-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">
            {current}/{total}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <span className="text-xs text-white font-bold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;