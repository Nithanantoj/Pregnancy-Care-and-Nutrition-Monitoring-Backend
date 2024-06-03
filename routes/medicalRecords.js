const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const doctorAuth = require('../middleware/doctorAuth');
const MedicalHistory = require('../Models/MedicalHistory');
const CurrentPregnancyDetails = require('../Models/currentPregnancyDetails');
const VisitNotes = require('../Models/visitNotes');
const User = require('../Models/User');

// Add or Update Medical History
router.post('/medical-history', doctorAuth, async (req, res) => {
    try {
        const { userId, previousPregnancies, preExistingConditions, allergies } = req.body;

        let medicalHistory = await MedicalHistory.findOne({ user: userId });
        if (medicalHistory) {
            medicalHistory.previousPregnancies = previousPregnancies;
            medicalHistory.preExistingConditions = preExistingConditions;
            medicalHistory.allergies = allergies;
        } else {
            medicalHistory = new MedicalHistory({ user: userId, previousPregnancies, preExistingConditions, allergies });
        }

        await medicalHistory.save();
        res.json({ msg: 'Medical history updated successfully', medicalHistory });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add or Update Current Pregnancy Details
router.post('/current-pregnancy-details', doctorAuth, async (req, res) => {
    try {
        const { userId, pregnancyConfirmedDate, confirmedDoctorName, dueDate } = req.body;

        let currentPregnancyDetails = await CurrentPregnancyDetails.findOne({ user: userId });
        if (currentPregnancyDetails) {
            currentPregnancyDetails.pregnancyConfirmedDate = pregnancyConfirmedDate;
            currentPregnancyDetails.confirmedDoctorName = confirmedDoctorName;
            currentPregnancyDetails.dueDate = dueDate;
        } else {
            currentPregnancyDetails = new CurrentPregnancyDetails({
                user: userId,
                pregnancyConfirmedDate,
                confirmedDoctorName,
                dueDate
            });
        }

        await currentPregnancyDetails.save();
        res.json({ msg: 'Current pregnancy details updated successfully', currentPregnancyDetails });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/visit-notes', doctorAuth, async (req, res) => {
    try {
        const { userId, checkupDate, weight, bloodPressure, bloodSugar, fetalHeartRate, ultrasoundReports, medicationPrescribed, dietarySupplements, recommendations, followUpAppointments } = req.body;

        let visitNotes = await VisitNotes.findOne({ user: userId });
        const visitDetails = {
            checkupDate,
            weight,
            bloodPressure,
            bloodSugar,
            fetalHeartRate,
            ultrasoundReports,
            medicationPrescribed,
            dietarySupplements,
            recommendations,
            followUpAppointments
        };

        if (visitNotes) {
            visitNotes.details.push(visitDetails);
        } else {
            visitNotes = new VisitNotes({
                user: userId,
                details: [visitDetails]
            });
        }

        await visitNotes.save();
        res.json({ msg: 'Visit notes updated successfully', visitNotes });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const medicalHistory = await MedicalHistory.findOne({ user: req.user.id });
        const currentPregnancyDetails = await CurrentPregnancyDetails.findOne({ user: req.user.id });
        const visitNotes = await VisitNotes.findOne({ user: req.user.id });

        if (!user || !medicalHistory || !currentPregnancyDetails || !labTests || !visitNotes) {
            return res.status(404).json({ msg: 'User profile or medical records not found' });
        }

        const userProfile = {
            user: {
                name: user.name,
                phone_no: user.phone_no,
                whatsapp_no: user.whatsapp_no,
                email: user.email,
                age: user.age,
            },
            medicalHistory,
            currentPregnancyDetails,
            visitNotes
        };

        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
