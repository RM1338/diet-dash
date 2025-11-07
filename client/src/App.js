import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/navigation/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import GameList from './pages/games/GameList';
import FoodSorting from './pages/games/FoodSorting';
import MealCreator from './pages/games/MealCreator';
import NutritionQuiz from './pages/games/NutritionQuiz';
import CalorieCounter from './pages/games/CalorieCounter';
import VitaminMatch from './pages/games/VitaminMatch';
import ShoppingSpree from './pages/games/ShoppingSpree';
import NutritionRecipeCreator from './pages/games/NutritionRecipeCreator';
import Profile from './pages/profile/Profile';
import Leaderboard from './pages/dashboard/Leaderboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-2xl text-readable">Loading...</div>
    </div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            {/* Add padding-top to prevent content from hiding under island navbar */}
            <div className="pt-28">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/games" element={
                  <ProtectedRoute>
                    <GameList />
                  </ProtectedRoute>
                } />
                
                {/* Game Routes - Original 3 Games */}
                <Route path="/games/food-sorting" element={
                  <ProtectedRoute>
                    <FoodSorting />
                  </ProtectedRoute>
                } />
                
                <Route path="/games/meal-creator" element={
                  <ProtectedRoute>
                    <MealCreator />
                  </ProtectedRoute>
                } />
                
                <Route path="/games/nutrition-quiz" element={
                  <ProtectedRoute>
                    <NutritionQuiz />
                  </ProtectedRoute>
                } />

                {/* Game Routes - New 3 Games */}
                <Route path="/games/calorie-counter" element={
                  <ProtectedRoute>
                    <CalorieCounter />
                  </ProtectedRoute>
                } />
                
                <Route path="/games/vitamin-match" element={
                  <ProtectedRoute>
                    <VitaminMatch />
                  </ProtectedRoute>
                } />
                
                <Route path="/games/shopping-spree" element={
                  <ProtectedRoute>
                    <ShoppingSpree />
                  </ProtectedRoute>
                } />

                {/* Nutrition Recipe Creator Game */}
                <Route path="/games/nutrition-recipe-creator" element={
                  <ProtectedRoute>
                    <NutritionRecipeCreator />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;