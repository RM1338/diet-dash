import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data), // Added update to auth
};

// User API
export const userAPI = {
  updateProfile: (data) => api.put('/auth/profile', data), // Changed to auth endpoint
  getUser: (userId) => api.get(`/users/${userId}`),
};

// Game API
export const gameAPI = {
  getGames: () => api.get('/games'),
  getGameData: (gameId) => api.get(`/games/${gameId}`),
  submitGameScore: (gameId, data) => api.post(`/games/${gameId}/play`, data),
};

// Gamification API
export const gamificationAPI = {
  getUserProgress: (userId) => api.get(`/gamification/progress/${userId}`),
  getUserBadges: (userId) => api.get(`/gamification/badges/${userId}`),
  getLeaderboard: (params = {}) => api.get('/gamification/leaderboard', { params }),
  awardPoints: (data) => api.post('/gamification/points', data),
};

export default api;