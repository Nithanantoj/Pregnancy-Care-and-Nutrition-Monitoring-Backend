const mongoose = require('mongoose');

const previousMedicalHistorySchema = new mongoose.Schema({
    previousPregnancies: { type: Number, required: true },
    preExistingConditions: { type: String, required: true },
    allergies: { type: String, required: true }
});

module.exports = mongoose.model('PreviousMedicalHistory', previousMedicalHistorySchema);
