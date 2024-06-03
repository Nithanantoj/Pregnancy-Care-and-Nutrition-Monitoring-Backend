const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doctor = require('../Models/Doctor');
const User = require('../Models/User');
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

// Create Account for Pregnant Woman by Gynecologist Doctor
router.post('/create-account', doctorAuth, async (req, res) => {
    try {
        const { name, email, password, phone_no, whatsapp_no } = req.body;

        // Check if the doctor is a gynecologist
        const doctor = await Doctor.findById(req.doctor.id);
        if (!doctor || doctor.specialty.toLowerCase() !== 'gynecologist') {
            return res.status(403).json({ msg: 'Not authorized to create accounts for pregnant women' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone_no,
            whatsapp_no,
            role: 'pregnant_woman'
        });

        await user.save();
        res.json({ msg: 'Pregnant woman account created successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
