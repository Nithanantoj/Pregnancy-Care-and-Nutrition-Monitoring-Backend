// routes/medications.js

const express = require('express');
const router = express.Router();
const Medication = require('../Models/Medication');
const doctorAuth = require('../middleware/doctorAuth');
const auth = require('../middleware/auth'); // Import auth middleware

// Add or update medication details
router.post('/add-medication/:patientId', doctorAuth, async (req, res) => {
    const { medition, numberOfDays } = req.body;
    const patientId = req.params.patientId;
    const doctorId = req.doctor.id; // Retrieve doctor ID from authenticated user object

    try {
        let medication = await Medication.findOne({ patient: patientId });

        if (medication) {
            // Update existing medication
            medication.doctor = doctorId;
            medication.medition = medition;
            medication.numberOfDays = numberOfDays;
            await medication.save();

            res.status(200).json({ message: 'Medication updated successfully', medication });
        } else {
            // Add new medication
            medication = new Medication({ patient: patientId, doctor: doctorId, medition, numberOfDays });
            await medication.save();

            res.status(201).json({ message: 'Medication added successfully', medication });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// View medication details for a patient
router.get('/view-medication/:patientId', doctorAuth, async (req, res) => {
    const patientId = req.params.patientId;

    try {
        const medication = await Medication.findOne({ patient: patientId });
        if (!medication) {
            return res.status(404).json({ message: 'Medication details not found for this patient' });
        }

        res.status(200).json({ medication });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View medication details for the authenticated patient
router.get('/patient-view-medication', auth, async (req, res) => {
    const patientId = req.user.id; // Assuming the authenticated user's ID is stored in req.user.id 

    try {
        const medication = await Medication.findOne({ patient: patientId });
        if (!medication) {
            return res.status(404).json({ message: 'Medication details not found for this patient' });
        }

        res.status(200).json({ medication });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete-medication/:medicationId/:meditionId', doctorAuth, async (req, res) => {
    try {
        const { medicationId, meditionId } = req.params;

        // Find the medication document and remove the specified medition
        const medication = await Medication.findByIdAndUpdate(
            medicationId,
            { $pull: { medition: { _id: meditionId } } },
            { new: true }
        );

        if (!medication) {
            return res.status(404).json({ msg: 'Medication not found' });
        }

        res.json({ msg: 'Medication removed successfully', medication });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
