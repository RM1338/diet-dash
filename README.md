# 🥗 DietDash - Gamified Nutrition Learning Platform

DietDash is a modern, interactive web application that makes learning
about nutrition fun and engaging through gamification. It combines
education and entertainment to promote healthy eating habits through
interactive challenges, quizzes, and progress tracking.

------------------------------------------------------------------------

## 🚀 Overview

DietDash empowers students to understand nutrition fundamentals while
playing. With role-based access for students, teachers, and parents, it
encourages collaboration, progress tracking, and healthy competition.

------------------------------------------------------------------------

## ✨ Key Features

-   🎮 **6 Interactive Nutrition Games** --- Food Sorting, Meal Creator,
    Nutrition Quiz, Calorie Counter, Vitamin Match, Shopping Spree
-   🏆 **Gamification System** --- Points, levels, badges, and
    leaderboards
-   👤 **Multi-Role Support** --- Student, Teacher, and Parent accounts
-   🌓 **Dark/Light Theme** --- Glassmorphic interface with dynamic
    theme toggle
-   📊 **Progress Tracking** --- Real-time statistics and achievement
    tracking
-   🎯 **Personalized Profiles** --- Custom avatars and editable profile
    sections

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React.js (Functional Components, Hooks)
-   React Router
-   Axios
-   TailwindCSS
-   Heroicons

### Backend

-   Node.js
-   Express.js
-   MongoDB (Mongoose)
-   JWT Authentication
-   Bcrypt

------------------------------------------------------------------------

## ⚡ Getting Started

### Prerequisites

-   Node.js (v14+)
-   MongoDB installed and running
-   npm or yarn

### Setup Instructions

``` bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/diet-dash.git
cd diet-dash

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Create environment variables
# Inside server/.env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# 5. Start backend
cd server
npm start

# 6. Start frontend (in a new terminal)
cd client
npm start
```

Then, open <http://localhost:3000> in your browser.

------------------------------------------------------------------------

## 📂 Project Structure

    diet-dash/
    │
    ├── client/                        # React frontend
    │   ├── src/
    │   │   ├── components/            # Reusable UI components
    │   │   ├── context/               # Auth & Theme context
    │   │   ├── pages/                 # Page components
    │   │   └── services/              # API services
    │
    ├── server/                        # Node.js backend
    │   ├── models/                    # MongoDB models
    │   ├── routes/                    # API endpoints
    │   ├── middleware/                # Authentication middleware
    │   └── config/                    # Config and database setup
    │
    ├── .gitignore                     # Ignored files
    ├── package.json                   # Dependencies & scripts
    └── README.md                      # Project documentation

------------------------------------------------------------------------

## 🧠 Future Enhancements

-   AI-powered diet recommendations\
-   Weekly nutrition challenges\
-   Social leaderboards and friend invites\
-   Mobile app (React Native version)

------------------------------------------------------------------------

## 👥 Team

-   **Ronel Abraham Mathew** --- Full Stack Developer

------------------------------------------------------------------------

## 🙏 Acknowledgments

-   **Google Cloud** --- Infrastructure and hosting support
-   **Karunya Institute of Technology and Sciences** --- Academic
    guidance
-   **GeeksforGeeks** --- Learning and development resources

------------------------------------------------------------------------

## 🪪 License

This project is licensed under the **MIT License** --- see the LICENSE
file for details.
