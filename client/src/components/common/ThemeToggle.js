import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="glass-strong p-4 rounded-2xl hover:scale-110 transition-all duration-300 group"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative">
        {isDarkMode ? (
          <span className="text-3xl group-hover:rotate-12 transition-transform duration-300 inline-block">
            🌙
          </span>
        ) : (
          <span className="text-3xl group-hover:rotate-45 transition-transform duration-300 inline-block">
            ☀️
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;