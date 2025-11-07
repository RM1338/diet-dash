import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gamificationAPI } from '../../services/api';

const NutritionRecipeCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [nutritionScore, setNutritionScore] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [showIngredientsAlert, setShowIngredientsAlert] = useState(false);

  const ingredients = [
    { id: 1, name: 'Spinach', emoji: '🥬', category: 'vegetable', nutrition: { protein: 3, vitamins: 5, fiber: 3 } },
    { id: 2, name: 'Chicken', emoji: '🍗', category: 'protein', nutrition: { protein: 8, vitamins: 2, fiber: 0 } },
    { id: 3, name: 'Brown Rice', emoji: '🍚', category: 'grain', nutrition: { protein: 2, vitamins: 2, fiber: 4 } },
    { id: 4, name: 'Salmon', emoji: '🐟', category: 'protein', nutrition: { protein: 9, vitamins: 4, fiber: 0 } },
    { id: 5, name: 'Broccoli', emoji: '🥦', category: 'vegetable', nutrition: { protein: 3, vitamins: 6, fiber: 4 } },
    { id: 6, name: 'Avocado', emoji: '🥑', category: 'healthy-fat', nutrition: { protein: 2, vitamins: 5, fiber: 3 } },
    { id: 7, name: 'Quinoa', emoji: '🌾', category: 'grain', nutrition: { protein: 4, vitamins: 3, fiber: 5 } },
    { id: 8, name: 'Eggs', emoji: '🥚', category: 'protein', nutrition: { protein: 6, vitamins: 4, fiber: 0 } },
    { id: 9, name: 'Tomato', emoji: '🍅', category: 'vegetable', nutrition: { protein: 1, vitamins: 5, fiber: 2 } },
    { id: 10, name: 'Sweet Potato', emoji: '🍠', category: 'grain', nutrition: { protein: 2, vitamins: 6, fiber: 4 } },
    { id: 11, name: 'Greek Yogurt', emoji: '🥛', category: 'dairy', nutrition: { protein: 7, vitamins: 3, fiber: 0 } },
    { id: 12, name: 'Almonds', emoji: '🌰', category: 'healthy-fat', nutrition: { protein: 5, vitamins: 4, fiber: 3 } },
    { id: 13, name: 'Blueberries', emoji: '🫐', category: 'fruit', nutrition: { protein: 1, vitamins: 7, fiber: 3 } },
    { id: 14, name: 'Banana', emoji: '🍌', category: 'fruit', nutrition: { protein: 1, vitamins: 4, fiber: 3 } },
    { id: 15, name: 'Olive Oil', emoji: '🫒', category: 'healthy-fat', nutrition: { protein: 0, vitamins: 3, fiber: 0 } },
    { id: 16, name: 'Lentils', emoji: '🫘', category: 'protein', nutrition: { protein: 8, vitamins: 3, fiber: 6 } },
    { id: 17, name: 'Kale', emoji: '🥬', category: 'vegetable', nutrition: { protein: 3, vitamins: 8, fiber: 3 } },
    { id: 18, name: 'Strawberries', emoji: '🍓', category: 'fruit', nutrition: { protein: 1, vitamins: 6, fiber: 2 } }
  ];

  const mealTypes = [
    { name: 'Breakfast', emoji: '🌅', requiredCategories: ['protein', 'grain', 'fruit'] },
    { name: 'Lunch', emoji: '☀️', requiredCategories: ['protein', 'vegetable', 'grain'] },
    { name: 'Dinner', emoji: '🌙', requiredCategories: ['protein', 'vegetable', 'grain'] },
    { name: 'Smoothie', emoji: '🥤', requiredCategories: ['fruit', 'protein', 'healthy-fat'] },
    { name: 'Salad', emoji: '🥗', requiredCategories: ['vegetable', 'protein', 'healthy-fat'] }
  ];

  const [selectedMealType, setSelectedMealType] = useState(mealTypes[0]);

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.find(item => item.id === ingredient.id)) {
      setSelectedIngredients(selectedIngredients.filter(item => item.id !== ingredient.id));
    } else {
      if (selectedIngredients.length < 6) {
        setSelectedIngredients([...selectedIngredients, ingredient]);
      }
    }
  };

  const calculateNutrition = () => {
    const total = { protein: 0, vitamins: 0, fiber: 0 };
    selectedIngredients.forEach(ing => {
      total.protein += ing.nutrition.protein;
      total.vitamins += ing.nutrition.vitamins;
      total.fiber += ing.nutrition.fiber;
    });
    return total;
  };

  const evaluateRecipe = () => {
    if (selectedIngredients.length < 3) {
      setShowIngredientsAlert(true);
      return;
    }

    if (!recipeName.trim()) {
      setShowNameAlert(true);
      return;
    }

    const nutrition = calculateNutrition();
    const categories = [...new Set(selectedIngredients.map(ing => ing.category))];
    const hasRequiredCategories = selectedMealType.requiredCategories.every(cat => 
      categories.includes(cat)
    );

    let calculatedScore = 0;
    calculatedScore += nutrition.protein * 3;
    calculatedScore += nutrition.vitamins * 2;
    calculatedScore += nutrition.fiber * 2;
    
    if (hasRequiredCategories) {
      calculatedScore += 30;
    }

    if (selectedIngredients.length >= 5) {
      calculatedScore += 20;
    }

    setNutritionScore(nutrition);
    setScore(calculatedScore);
    setShowResult(true);

    if (calculatedScore >= 80) {
      setGameComplete(true);
      awardPoints(calculatedScore, calculatedScore >= 100);
    }
  };

  const awardPoints = async (earnedPoints, perfectScore) => {
    try {
      await gamificationAPI.awardPoints({
        points: earnedPoints,
        gameId: 'nutrition_recipe_creator',
        perfectScore
      });
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const resetGame = () => {
    setSelectedIngredients([]);
    setRecipeName('');
    setShowResult(false);
    setScore(0);
    setNutritionScore(null);
    setGameComplete(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'protein': 'bg-red-100 text-red-800',
      'vegetable': 'bg-green-100 text-green-800',
      'fruit': 'bg-purple-100 text-purple-800',
      'grain': 'bg-yellow-100 text-yellow-800',
      'dairy': 'bg-blue-100 text-blue-800',
      'healthy-fat': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-content">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-readable mb-2">
            👨‍🍳 Nutrition Recipe Creator
          </h1>
          <p className="text-readable" style={{ color: 'var(--color-text-secondary)' }}>
            Create healthy recipes and learn about balanced nutrition!
          </p>
        </div>
        <button
          onClick={() => navigate('/games')}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
        >
          ← Back to Games
        </button>
      </div>

      {/* Meal Type Selection */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-2xl font-bold text-readable mb-4">Choose Your Meal Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mealTypes.map((meal) => (
            <button
              key={meal.name}
              onClick={() => setSelectedMealType(meal)}
              className={`p-4 rounded-xl font-semibold text-lg transition ${
                selectedMealType.name === meal.name
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                  : 'bg-surface text-readable hover:bg-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">{meal.emoji}</div>
              {meal.name}
            </button>
          ))}
        </div>
        <div className="mt-4 text-sm text-readable">
          <strong>Required:</strong> {selectedMealType.requiredCategories.map(cat => 
            <span key={cat} className={`inline-block px-2 py-1 rounded-full mr-2 ${getCategoryColor(cat)}`}>
              {cat}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredient Selection */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold text-readable mb-4">
              Select Ingredients ({selectedIngredients.length}/6)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ingredients.map((ingredient) => {
                const isSelected = selectedIngredients.find(item => item.id === ingredient.id);
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    disabled={selectedIngredients.length >= 6 && !isSelected}
                    className={`p-4 rounded-xl transition transform ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                        : 'bg-surface text-readable hover:bg-gray-300 hover:scale-105'
                    } ${selectedIngredients.length >= 6 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-4xl mb-2">{ingredient.emoji}</div>
                    <div className="font-bold text-sm">{ingredient.name}</div>
                    <div className={`text-xs mt-2 px-2 py-1 rounded-full ${getCategoryColor(ingredient.category)}`}>
                      {ingredient.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recipe Preview */}
        <div>
          <div className="glass-card p-6 sticky top-24">
            <h3 className="text-2xl font-bold text-readable mb-4">Your Recipe</h3>
            
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Name your recipe..."
              className="w-full p-3 rounded-lg border-2 border-primary mb-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
            />


            <div className="mb-4">
              <h4 className="font-bold text-readable mb-2">Ingredients:</h4>
              {selectedIngredients.length === 0 ? (
                <p className="text-sm italic" style={{ color: 'var(--color-text-secondary)' }}>
                  No ingredients selected yet
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedIngredients.map((ing) => (
                    <li key={ing.id} className="flex items-center gap-2">
                      <span className="text-2xl">{ing.emoji}</span>
                      <span className="text-readable">{ing.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {showResult && nutritionScore && (
              <div className="mb-4 p-4 bg-green-100 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Nutrition Score:</h4>
                <div className="space-y-1 text-sm">
                  <div>💪 Protein: {nutritionScore.protein}</div>
                  <div>🌟 Vitamins: {nutritionScore.vitamins}</div>
                  <div>🌾 Fiber: {nutritionScore.fiber}</div>
                </div>
                <div className="mt-3 text-xl font-bold text-green-800">
                  Score: {score}/120
                </div>
                {score >= 80 && (
                  <div className="mt-2 text-green-800 font-bold">
                    🎉 Healthy Recipe!
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={evaluateRecipe}
                disabled={selectedIngredients.length < 3}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  selectedIngredients.length < 3
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                }`}
              >
                Evaluate Recipe
              </button>
              <button
                onClick={resetGame}
                className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {gameComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="text-6xl mb-4">👨‍🍳🎉</div>
            <h2 className="text-3xl font-bold text-readable mb-2">Amazing Recipe!</h2>
            <p className="text-xl text-readable mb-2">"{recipeName}"</p>
            <p className="text-readable mb-4">You created a super healthy recipe!</p>
            <div className="text-4xl font-bold text-primary mb-6">
              +{score} Points
            </div>
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-lg transition"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate('/games')}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modals */}
      {showNameAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-readable mb-2">Name Your Recipe!</h2>
            <p className="text-readable mb-6">Please enter a name for your recipe before evaluating it.</p>
            <button
              onClick={() => setShowNameAlert(false)}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showIngredientsAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🥘</div>
            <h2 className="text-2xl font-bold text-readable mb-2">More Ingredients Needed!</h2>
            <p className="text-readable mb-6">Please select at least 3 ingredients to create your recipe.</p>
            <button
              onClick={() => setShowIngredientsAlert(false)}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionRecipeCreator;