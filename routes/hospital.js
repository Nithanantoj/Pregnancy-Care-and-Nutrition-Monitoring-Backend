const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../Models/Hospital');
const Doctor = require('../Models/Doctor');
const auth = require('../middleware/auth');
const hospitalAuth = require('../middleware/hospitalAuth');

const router = express.Router();

// Hospital Signup
router.post('/signup-hospital', async (req, res) => {
    try {
        const { name, address, phone, email, password, description, facilities, location } = req.body;

        // Check if hospital already exists
        let hospital = await Hospital.findOne({ email });
        if (hospital) {
            return res.status(400).json({ msg: 'Hospital already exists' });
        }

        // Create new hospital
        hospital = new Hospital({
            name,
            address,
            phone,
            email,
            password,
            description,
            facilities,
            location
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        hospital.password = await bcrypt.hash(password, salt);

        // Save hospital
        await hospital.save();

        // Create JWT token
        const payload = {
            hospital: {
                id: hospital.id,
                role: 'hospital'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Hospital Login
router.post('/login-hospital', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if hospital exists
        let hospital = await Hospital.findOne({ email });
        if (!hospital) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            hospital: {
                id: hospital.id,
                role: 'hospital'
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

// Create Doctor Account
router.post('/create-doctor', hospitalAuth, async (req, res) => {
    try {
        const { name, email, password, phone_no, specialty } = req.body;

        // Check if doctor already exists
        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({ msg: 'Doctor already exists' });
        }

        // Create new doctor
        doctor = new Doctor({
            name,
            email,
            password,
            phone_no,
            specialty,
            hospital: req.hospital.id // Use req.hospital from the decoded token
        });

        // Save doctor
        await doctor.save();

        // Add doctor to hospital's doctor list
        await Hospital.findByIdAndUpdate(req.hospital.id, { $push: { doctors: doctor._id } });

        res.json({ msg: 'Doctor created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
