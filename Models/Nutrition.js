const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NutritionSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    calories: {
         type: Number 
    },
    protein: {
         type: Number
    },
    carbs: {
         type: Number 
    },
    fats: {
         type: Number 
    },
    folicAcid: {
         type: Number 
    },
    iron: {
         type: Number 
    },
    calcium: {
         type: Number 
    },
    omega3: {
         type: Number 
    },
    vitaminD: {
         type: Number 
    },
    vitaminC: {
         type: Number }
    
});

module.exports = mongoose.model('Nutrition', NutritionSchema);
