const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../Models/Appointment');

// View appointment details
router.get('/appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name')
            .populate('hospital', 'name');

        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Book an appointment
router.post('/bookappointments', auth, async (req, res) => {
    try {
        const { doctorId, hospitalId, date, reason } = req.body;

        const appointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            hospital: hospitalId,
            date,
            reason
        });

        await appointment.save();
        res.json({ msg: 'Appointment booked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
