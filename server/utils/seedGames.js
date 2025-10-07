const mongoose = require('mongoose');
require('dotenv').config();

const gameSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  estimatedTime: String,
  icon: String,
  route: String,
  category: String,
  points: Number,
  isActive: { type: Boolean, default: true }
});

const Game = mongoose.model('Game', gameSchema);

const gamesData = [
  {
    title: 'Food Group Sorting',
    description: 'Categorize foods into the correct nutritional groups',
    difficulty: 'easy',
    estimatedTime: '3 min',
    icon: '🥗',
    route: '/games/food-sorting',
    category: 'classification',
    points: 10,
    isActive: true
  },
  {
    title: 'Balanced Meal Creator',
    description: 'Build nutritionally balanced meals',
    difficulty: 'medium',
    estimatedTime: '5 min',
    icon: '🍽️',
    route: '/games/meal-creator',
    category: 'planning',
    points: 15,
    isActive: true
  },
  {
    title: 'Nutrition Knowledge Quiz',
    description: 'Test your knowledge about healthy eating',
    difficulty: 'medium',
    estimatedTime: '4 min',
    icon: '🧠',
    route: '/games/nutrition-quiz',
    category: 'knowledge',
    points: 15,
    isActive: true
  },
  // NEW GAMES BELOW
  {
    title: 'Calorie Counter Challenge',
    description: 'Estimate calories in different meals and snacks',
    difficulty: 'medium',
    estimatedTime: '5 min',
    icon: '🔢',
    route: '/games/calorie-counter',
    category: 'estimation',
    points: 15,
    isActive: true
  },
  {
    title: 'Vitamin Match Game',
    description: 'Match vitamins with their food sources',
    difficulty: 'easy',
    estimatedTime: '3 min',
    icon: '💊',
    route: '/games/vitamin-match',
    category: 'matching',
    points: 10,
    isActive: true
  },
  {
    title: 'Healthy Shopping Spree',
    description: 'Shop for healthy groceries within a budget',
    difficulty: 'hard',
    estimatedTime: '7 min',
    icon: '🛒',
    route: '/games/shopping-spree',
    category: 'strategy',
    points: 20,
    isActive: true
  }
];

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Game.deleteMany({});
    console.log('Cleared existing games');

    await Game.insertMany(gamesData);
    console.log('✅ Games seeded successfully!');
    console.log(`Added ${gamesData.length} games`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding games:', error);
    process.exit(1);
  }
};

seedGames();