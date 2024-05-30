const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../Models/Doctor');
const doctorAuth = require('../middleware/doctorAuth');

const router = express.Router();

// Doctor Login
router.post('/login-doctor', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if doctor exists
        let doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password (plain text comparison)
        if (password !== doctor.password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            doctor: {
                id: doctor.id,
                role: 'doctor'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Login successful' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
