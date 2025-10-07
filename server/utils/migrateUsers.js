const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update all users to have the gamification structure
    const result = await User.updateMany(
      { 
        $or: [
          { 'gamification.unlockedBadges': { $exists: false } },
          { 'gamification.streak': { $exists: false } }
        ]
      },
      {
        $set: {
          'gamification.totalPoints': 0,
          'gamification.level': 1,
          'gamification.gamesPlayed': 0,
          'gamification.unlockedBadges': [],
          'gamification.streak': {
            current: 0,
            longest: 0
          }
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    console.log('Migration complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();