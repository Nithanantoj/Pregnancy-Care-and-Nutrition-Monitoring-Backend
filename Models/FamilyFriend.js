const mongoose = require('mongoose');

const familyFriendSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true},
    email: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('FamilyFriend', familyFriendSchema);
