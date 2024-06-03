const mongoose = require('mongoose');

const currentPregnancyDetailsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pregnancyConfirmedDate: { type: Date, required: true },
    confirmedDoctorName: { type: String, required: true },
    dueDate: { type: Date, required: true }
    }, {
    timestamps: true
});
    
module.exports = mongoose.model('CurrentPregnancyDetails', currentPregnancyDetailsSchema);
