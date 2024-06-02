const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Nutrition = require('../Models/Nutrition');
const auth = require('../middleware/auth');
const doctorAuth = require('../middleware/doctorAuth');
const { calculateNutrition , getRecommendations } = require('../utils/nutritionCalculator'); // Adjust the path as needed

// Route for doctors to update nutrition details
router.put('/update/:patientId', doctorAuth, async (req, res) => {
    try {
        const { patientId } = req.params;

        // Validate patientId
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ msg: 'Invalid patient ID' });
        }

        const nutritionDetails = req.body;
        let nutrition = await Nutrition.findOne({ patient: patientId });

        if (!nutrition) {
            nutrition = new Nutrition({
                patient: patientId,
                doctor: req.doctor.id,
                ...nutritionDetails
            });
        } else {
            Object.assign(nutrition, nutritionDetails);
        }

        await nutrition.save();
        res.json({ msg: 'Nutrition details updated successfully', nutrition });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route for pregnant women to view their nutrition details
router.get('/view/:patientId', auth, async (req, res) => {
    try {
        const { patientId } = req.params;

        // Validate patientId
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ msg: 'Invalid patient ID' });
        }

        const nutrition = await Nutrition.findOne({ patient: patientId });

        if (!nutrition) {
            return res.status(404).json({ msg: 'No nutrition details found for the patient' });
        }

        res.json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route for pregnant women to calculate their nutrition intake and get recommendations
router.post('/calculate/:userId', async (req, res) => {
    try {
        const { foodIntake } = req.body;
        const { userId } = req.params;
        const { isVegetarian } = req.body; // Assuming isVegetarian is provided as a query parameter
        const intake = await calculateNutrition(foodIntake);
        const recommendations = await getRecommendations(userId, intake, isVegetarian);
        res.json({ intake, recommendations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
