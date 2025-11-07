import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    applyTheme();
  }, [isDarkMode]);

  const applyTheme = () => {
    const root = document.documentElement;

    if (isDarkMode) {
      // Dark mode glassmorphic colors
      root.style.setProperty('--color-primary', '#22C55E');
      root.style.setProperty('--color-secondary', '#F97316');
      root.style.setProperty('--color-accent', '#A855F7');
      root.style.setProperty('--color-background', '#0f172a');
      root.style.setProperty('--color-background-gradient-start', '#1e293b');
      root.style.setProperty('--color-background-gradient-end', '#0f172a');
      root.style.setProperty('--color-surface', 'rgba(30, 41, 59, 0.4)');
      root.style.setProperty('--color-surface-hover', 'rgba(30, 41, 59, 0.6)');
      root.style.setProperty('--color-text', '#f8fafc');
      root.style.setProperty('--color-text-secondary', '#cbd5e1');
      root.style.setProperty('--color-border', 'rgba(148, 163, 184, 0.2)');
      root.style.setProperty('--glass-blur', '12px');
      document.documentElement.classList.add('dark');
    } else {
      // Light mode glassmorphic colors
      root.style.setProperty('--color-primary', '#22C55E');
      root.style.setProperty('--color-secondary', '#F97316');
      root.style.setProperty('--color-accent', '#A855F7');
      root.style.setProperty('--color-background', '#f0f9ff');
      root.style.setProperty('--color-background-gradient-start', '#e0f2fe');
      root.style.setProperty('--color-background-gradient-end', '#fce7f3');
      root.style.setProperty('--color-surface', 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--color-surface-hover', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--color-text', '#0f172a');
      root.style.setProperty('--color-text-secondary', '#475569');
      root.style.setProperty('--color-border', 'rgba(148, 163, 184, 0.3)');
      root.style.setProperty('--glass-blur', '10px');
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    // Add transitioning class to body
    document.body.classList.add('theme-transitioning');
    setIsTransitioning(true);

    // Toggle theme
    setIsDarkMode(!isDarkMode);

    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
      setIsTransitioning(false);
    }, 600); // Match the CSS transition duration
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    isTransitioning
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;