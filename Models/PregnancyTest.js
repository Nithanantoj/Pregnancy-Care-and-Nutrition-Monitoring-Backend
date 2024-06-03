const mongoose = require('mongoose');
const Counter = require('./Counter');

const testResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String, required: true },
    resultPdf: { type: String, required: true } // Path to the PDF file
});

const pregnancyTestSchema = new mongoose.Schema({
    testNo: { type: Number, unique: true },
    testName: { type: String, required: true },
    testDescription: { type: String, required: true },
    testResults: [testResultSchema]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

pregnancyTestSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'testNo' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.testNo = counter.seq;
    }
    next();
});

module.exports = mongoose.model('PregnancyTest', pregnancyTestSchema);
