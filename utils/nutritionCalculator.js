// nutritionCalculator.js

const axios = require('axios');

// Nutritionix API credentials
const APP_ID = '5f8eb97c';
const APP_KEY = '1cf39bcd291a18e8379bf681ea38bbbf';

// Base URL for Nutritionix API
const API_BASE_URL = 'https://api.nutritionix.com/v1_1';

// Helper function to fetch nutrition data from Nutritionix API
const getNutrientContent = async (food) => {
    try {
        console.log(`Fetching nutrition data for: ${food}`);
        const response = await axios.get(`${API_BASE_URL}/search/${encodeURIComponent(food)}?results=0%3A1&fields=item_name%2Cbrand_name%2Cnf_calories%2Cnf_protein%2Cnf_total_carbohydrate%2Cnf_total_fat%2Cnf_folic_acid%2Cnf_iron_dv%2Cnf_calcium_dv%2Cnf_omega_3%2Cnf_vitamin_d%2Cnf_vitamin_c&appId=${APP_ID}&appKey=${APP_KEY}`);
        console.log(`Response from Nutritionix API:`, response.data);
        const foodItem = response.data.hits[0].fields;
        return {
            calories: foodItem.nf_calories || 0,
            protein: foodItem.nf_protein || 0,
            carbs: foodItem.nf_total_carbohydrate || 0,
            fats: foodItem.nf_total_fat || 0,
            folicAcid: foodItem.nf_folic_acid || 0,
            iron: foodItem.nf_iron_dv || 0,
            calcium: foodItem.nf_calcium_dv || 0,
            omega3: foodItem.nf_omega_3 || 0,
            vitaminD: foodItem.nf_vitamin_d || 0,
            vitaminC: foodItem.nf_vitamin_c || 0
        };
    } catch (error) {
        console.error('Error fetching nutrition data:', error.message);
        return null;
    }
};

// Function to calculate nutrition
const calculateNutrition = async (foodIntake) => {
    // Initialize total nutrition values
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFolicAcid = 0;
    let totalIron = 0;
    let totalCalcium = 0;
    let totalOmega3 = 0;
    let totalVitaminD = 0;
    let totalVitaminC = 0;

    // Loop through each food item in the food intake
    const promises = foodIntake.map(async ({ food, portion }) => {
        // Get the nutrition content for the current food item
        const nutrientContent = await getNutrientContent(food);
        
        // If nutrient content is available, calculate the total intake
        if (nutrientContent) {
            totalCalories += nutrientContent.calories * portion;
            totalProtein += nutrientContent.protein * portion;
            totalCarbs += nutrientContent.carbs * portion;
            totalFats += nutrientContent.fats * portion;
            totalFolicAcid += nutrientContent.folicAcid * portion;
            totalIron += nutrientContent.iron * portion;
            totalCalcium += nutrientContent.calcium * portion;
            totalOmega3 += nutrientContent.omega3 * portion;
            totalVitaminD += nutrientContent.vitaminD * portion;
            totalVitaminC += nutrientContent.vitaminC * portion;
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Return the total nutrition intake
    return {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
        folicAcid: totalFolicAcid,
        iron: totalIron,
        calcium: totalCalcium,
        omega3: totalOmega3,
        vitaminD: totalVitaminD,
        vitaminC: totalVitaminC
    };
};

module.exports = {
    calculateNutrition
};
