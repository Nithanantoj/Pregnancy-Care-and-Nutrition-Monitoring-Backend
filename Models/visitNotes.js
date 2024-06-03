const mongoose = require('mongoose');

const visitNotesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: [{
        checkupDate: { type: Date, required: true },
        weight: { type: Number, required: true },
        bloodPressure: { type: String, required: true },
        bloodSugar: { type: String, required: true },
        fetalHeartRate: { type: Number, required: true },
        ultrasoundReports: { type: String },
        medicationPrescribed: { type: String },
        dietarySupplements: { type: String },
        recommendations: { type: String },
        followUpAppointments: { type: Date }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('VisitNotes', visitNotesSchema);
