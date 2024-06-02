require('dotenv').config();
const axios = require('axios');
const Nutrition = require('../Models/Nutrition');



const recommendedFoodsVegetarian = {
    calories: ['nuts', 'seeds', 'avocado', 'oils', 'cheese', 'legumes', 'tofu'],
    protein: ['beans', 'tofu', 'legumes', 'nuts', 'seeds'],
    carbs: ['whole grains', 'fruits', 'vegetables', 'legumes'],
    fats: ['avocado', 'nuts', 'seeds', 'olive oil'],
    folicAcid: ['leafy greens', 'legumes', 'citrus fruits', 'fortified grains'],
    iron: ['lentils', 'beans', 'spinach', 'fortified cereals', 'tofu'],
    calcium: ['dairy alternatives', 'fortified plant milks', 'leafy greens', 'almonds'],
    omega3: ['flaxseeds', 'chia seeds', 'walnuts'],
    vitaminD: ['fortified plant milks', 'sunlight'],
    vitaminC: ['citrus fruits', 'strawberries', 'bell peppers', 'broccoli']
};

const recommendedFoodsNonVegetarian = {
    calories: ['lean meat', 'fish', 'eggs', 'dairy', 'poultry', 'nuts', 'seeds', 'legumes'],
    protein: ['lean meat', 'fish', 'eggs', 'dairy', 'poultry', 'beans', 'tofu', 'nuts', 'seeds'],
    carbs: ['whole grains', 'fruits', 'legumes'],
    fats: ['fatty fish', 'lean meats', 'eggs', 'dairy', 'avocado', 'nuts', 'seeds', 'olive oil'],
    folicAcid: ['liver', 'leafy greens', 'citrus fruits', 'fortified grains'],
    iron: ['red meat', 'liver', 'seafood', 'poultry', 'beans', 'lentils', 'spinach', 'fortified cereals'],
    calcium: ['dairy products', 'fish', 'leafy greens', 'almonds', 'dairy alternatives', 'fortified plant milks'],
    omega3: ['fatty fish', 'flaxseeds', 'chia seeds', 'walnuts'],
    vitaminD: ['fatty fish', 'fortified dairy products', 'sunlight'],
    vitaminC: ['kiwi', 'bell peppers', 'citrus fruits', 'strawberries', 'broccoli']
};


const getRecommendations = async (userId, intake, isVegetarian) => {
    const recommendedLevels = await Nutrition.findOne({ patient : userId });

    if (!recommendedLevels) {
        throw new Error('Recommended nutrition levels not found for the user.');
    }

    const recommendedFoods = isVegetarian ? recommendedFoodsVegetarian : recommendedFoodsNonVegetarian;

    const recommendations = {};

    for (const nutrient in intake) {
        if (intake.hasOwnProperty(nutrient)) {
            if (intake[nutrient] < recommendedLevels[nutrient]) {
                recommendations[nutrient] = recommendedFoods[nutrient];
            }
        }
    }

    return recommendations;
};

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_API_URL = 'https://api.edamam.com/api/nutrition-data';

const getNutrientContent = async (food) => {
    try {
        const response = await axios.get(EDAMAM_API_URL, {
            params: {
                app_id: EDAMAM_APP_ID,
                app_key: EDAMAM_APP_KEY,
                ingr: food
            }
        });

        const nutrients = response.data.totalNutrients;

        if (!nutrients || Object.keys(nutrients).length === 0) {
            console.warn(`No nutrient data found for ${food}`);
            return null;
        }

        return {
            calories: nutrients.ENERC_KCAL ? nutrients.ENERC_KCAL.quantity : 0,
            protein: nutrients.PROCNT ? nutrients.PROCNT.quantity : 0,
            carbs: nutrients.CHOCDF ? nutrients.CHOCDF.quantity : 0,
            fats: nutrients.FAT ? nutrients.FAT.quantity : 0,
            folicAcid: nutrients.FOLFD ? nutrients.FOLFD.quantity : 0,
            iron: nutrients.FE ? nutrients.FE.quantity : 0,
            calcium: nutrients.CA ? nutrients.CA.quantity : 0,
            omega3: nutrients.FAMS ? nutrients.FAMS.quantity : 0,
            vitaminD: nutrients.VITD ? nutrients.VITD.quantity : 0,
            vitaminC: nutrients.VITC ? nutrients.VITC.quantity : 0
        };
    } catch (error) {
        console.error('Error fetching nutrition data:', error.message);
        return null;
    }
};

const calculateNutrition = async (foodIntake) => {
    const promises = foodIntake.map(async ({ food, portion }) => {
        const nutrientContent = await getNutrientContent(food);
        return nutrientContent ? {
            calories: nutrientContent.calories * portion,
            protein: nutrientContent.protein * portion,
            carbs: nutrientContent.carbs * portion,
            fats: nutrientContent.fats * portion,
            folicAcid: nutrientContent.folicAcid * portion,
            iron: nutrientContent.iron * portion,
            calcium: nutrientContent.calcium * portion,
            omega3: nutrientContent.omega3 * portion,
            vitaminD: nutrientContent.vitaminD * portion,
            vitaminC: nutrientContent.vitaminC * portion
        } : null;
    });

    const results = await Promise.all(promises);

    const totalNutrition = results.reduce((acc, curr) => {
        if (curr) {
            acc.calories += curr.calories || 0;
            acc.protein += curr.protein || 0;
            acc.carbs += curr.carbs || 0;
            acc.fats += curr.fats || 0;
            acc.folicAcid += curr.folicAcid || 0;
            acc.iron += curr.iron || 0;
            acc.calcium += curr.calcium || 0;
            acc.omega3 += curr.omega3 || 0;
            acc.vitaminD += curr.vitaminD || 0;
            acc.vitaminC += curr.vitaminC || 0;
        }
        return acc;
    }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        folicAcid: 0,
        iron: 0,
        calcium: 0,
        omega3: 0,
        vitaminD: 0,
        vitaminC: 0
    });

    return totalNutrition;
};

module.exports = { calculateNutrition, getRecommendations };
