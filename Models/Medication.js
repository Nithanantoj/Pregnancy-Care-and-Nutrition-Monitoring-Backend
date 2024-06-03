const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimingSchema = new Schema({
    beforeFood: { type: Boolean, required: true },
    afterFood: { type: Boolean, required: true },
});

const MedicationSchema = new Schema({
    medition: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        timing: {
            morning: { type: TimingSchema, required: true },
            afternoon: { type: TimingSchema, required: true },
            night: { type: TimingSchema, required: true },
        }
    }],
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    numberOfDays: { type: Number, required: true }
});

module.exports = mongoose.model('Medication', MedicationSchema);
