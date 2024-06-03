const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    previousPregnancies: { type: Number, required: true },
    preExistingConditions: { type: String },
    allergies: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
