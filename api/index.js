// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('../server/routes/auth.routes'));
app.use('/api/users', require('../server/routes/user.routes'));
app.use('/api/gamification', require('../server/routes/gamification.routes'));
app.use('/api/games', require('../server/routes/game.routes'));

// Error handling middleware
app.use(require('../server/middleware/errorHandler'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DietDash API is running' });
});

module.exports = app;