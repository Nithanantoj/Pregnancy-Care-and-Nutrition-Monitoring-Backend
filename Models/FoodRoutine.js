const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodRoutineSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    vegetarian: {
        type: Boolean,
        default: true
    },
    breakfastTime: {
        type: String
    },
    lunchTime: {
        type: String
    },
    dinnerTime: {
        type: String
    }
});

module.exports = mongoose.model('FoodRoutine', FoodRoutineSchema);
