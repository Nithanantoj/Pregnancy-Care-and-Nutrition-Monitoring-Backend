const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_no: {type: String, required: true},
    whatsapp_no: {type: String, required: true},
    role: { type: String, enum: ['doctor', 'pregnant_woman'], required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
