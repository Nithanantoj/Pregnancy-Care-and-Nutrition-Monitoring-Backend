const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_no: { type: String, required: true },
    specialty: { type: String, required: true },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
