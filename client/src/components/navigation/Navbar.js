import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  HomeIcon, 
  UserIcon, 
  MoonIcon, 
  SunIcon,
  ArrowRightOnRectangleIcon,
  TrophyIcon,
  Bars3Icon,
  XMarkIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  TrophyIcon as TrophySolidIcon,
  HomeIcon as HomeSolidIcon,
  UserIcon as UserSolidIcon,
  PuzzlePieceIcon as PuzzlePieceSolidIcon
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, isTransitioning } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar - Compact Island Style */}
      <nav className="hidden lg:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4">
        <div className="glass-strong rounded-full shadow-2xl border border-opacity-30 px-4 py-2">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className="group pr-2">
              <div className="text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                🥗
              </div>
            </Link>

            {/* Divider */}
            <div className="h-10 w-px bg-border"></div>
            
            {/* Navigation Items with Text */}
            <div className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={`flex flex-col items-center px-4 py-2 rounded-2xl hover:bg-surface transition-all duration-300 group ${
                  isActive('/') ? 'bg-surface' : ''
                }`}
              >
                {isActive('/') ? (
                  <HomeSolidIcon className="w-5 h-5 text-primary mb-1" />
                ) : (
                  <HomeIcon className="w-5 h-5 text-readable group-hover:text-primary mb-1" />
                )}
                <span className={`text-xs font-semibold ${
                  isActive('/') ? 'text-primary' : 'text-readable group-hover:text-primary'
                }`}>
                  Home
                </span>
              </Link>

              <Link 
                to="/games" 
                className={`flex flex-col items-center px-4 py-2 rounded-2xl hover:bg-surface transition-all duration-300 group ${
                  isActive('/games') ? 'bg-surface' : ''
                }`}
              >
                {isActive('/games') ? (
                  <PuzzlePieceSolidIcon className="w-5 h-5 text-secondary mb-1" />
                ) : (
                  <PuzzlePieceIcon className="w-5 h-5 text-readable group-hover:text-secondary mb-1" />
                )}
                <span className={`text-xs font-semibold ${
                  isActive('/games') ? 'text-secondary' : 'text-readable group-hover:text-secondary'
                }`}>
                  Games
                </span>
              </Link>

              <Link 
                to="/leaderboard" 
                className={`flex flex-col items-center px-4 py-2 rounded-2xl hover:bg-surface transition-all duration-300 group ${
                  isActive('/leaderboard') ? 'bg-surface' : ''
                }`}
              >
                {isActive('/leaderboard') ? (
                  <TrophySolidIcon className="w-5 h-5 text-accent mb-1" />
                ) : (
                  <TrophyIcon className="w-5 h-5 text-readable group-hover:text-accent mb-1" />
                )}
                <span className={`text-xs font-semibold ${
                  isActive('/leaderboard') ? 'text-accent' : 'text-readable group-hover:text-accent'
                }`}>
                  Leaderboard
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-border"></div>

            {/* Right Side - User Info & Actions */}
            <div className="flex items-center space-x-2">
              {/* Points Display - More Visible */}
              <div className="flex items-center space-x-1.5 px-3 py-2 rounded-full glass border border-primary border-opacity-30">
                <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-primary text-sm">
                  {user.gamification?.totalPoints || 0}
                </span>
              </div>
              
              {/* Level Display - More Visible */}
              <div className="flex items-center space-x-1.5 px-3 py-2 rounded-full glass border border-accent border-opacity-30">
                <TrophySolidIcon className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent text-sm">
                  Lvl {user.gamification?.level || 1}
                </span>
              </div>

              {/* User Profile Icon */}
              <Link 
                to="/profile" 
                className={`p-2 rounded-full hover:bg-surface transition-all duration-300 group ${
                  isActive('/profile') ? 'bg-surface' : ''
                }`}
                title={user.username}
              >
                {isActive('/profile') ? (
                  <UserSolidIcon className="w-5 h-5 text-primary" />
                ) : (
                  <UserIcon className="w-5 h-5 text-readable group-hover:text-primary" />
                )}
              </Link>

              {/* Dark Mode Toggle with Animation */}
              <button
                onClick={toggleDarkMode}
                disabled={isTransitioning}
                className="p-2 rounded-full hover:bg-surface transition-all duration-300 theme-icon disabled:opacity-50"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <MoonIcon className="w-5 h-5 text-readable hover:text-blue-400 transition-colors" />
                ) : (
                  <SunIcon className="w-5 h-5 text-readable hover:text-yellow-400 transition-colors" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-all duration-300"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <div className="glass-strong rounded-2xl shadow-2xl border border-opacity-30 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-3xl">🥗</span>
            </Link>

            <div className="flex items-center space-x-2">
              {/* Points on Mobile */}
              <div className="flex items-center space-x-1 px-2 py-1 rounded-full glass border border-primary border-opacity-30">
                <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-primary text-xs">
                  {user.gamification?.totalPoints || 0}
                </span>
              </div>

              {/* Level on Mobile */}
              <div className="flex items-center space-x-1 px-2 py-1 rounded-full glass border border-accent border-opacity-30">
                <TrophySolidIcon className="w-4 h-4 text-accent" />
                <span className="font-bold text-accent text-xs">
                  {user.gamification?.level || 1}
                </span>
              </div>

              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                disabled={isTransitioning}
                className="glass p-2 rounded-full theme-icon disabled:opacity-50"
              >
                {isDarkMode ? (
                  <MoonIcon className="w-5 h-5 text-readable" />
                ) : (
                  <SunIcon className="w-5 h-5 text-readable" />
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="glass p-2 rounded-full"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-readable" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-readable" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 glass px-4 py-2 rounded-xl text-sm font-semibold text-readable hover:text-primary transition-all"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 glass px-4 py-2 rounded-xl text-sm font-semibold text-readable hover:text-secondary transition-all"
              >
                <PuzzlePieceIcon className="w-5 h-5" />
                <span>Games</span>
              </Link>
              <Link 
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 glass px-4 py-2 rounded-xl text-sm font-semibold text-readable hover:text-accent transition-all"
              >
                <TrophyIcon className="w-5 h-5" />
                <span>Leaderboard</span>
              </Link>
              <Link 
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 glass px-4 py-2 rounded-xl text-sm font-semibold text-readable transition-all"
              >
                <UserIcon className="w-5 h-5" />
                <span>{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 glass-strong px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:text-red-600 transition-all"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;