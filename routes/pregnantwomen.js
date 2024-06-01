const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const MedicalRecord = require('../Models/MedicalRecord');
const Medication = require('../Models/Medication');
const Nutrition = require('../Models/Nutrition');
const Appointment = require('../Models/Appointment');
const FamilyFriend = require('../Models/FamilyFriend');
const auth = require('../middleware/auth');

const router = express.Router();

// Pregnant Women Signup
router.post('/signup-pregnant-woman', async (req, res) => {
    try {
        const { name, email, password, phone_no, whatsapp_no } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            phone_no,
            whatsapp_no,
            role: 'pregnant_woman'
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: 'pregnant_woman'
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

// Pregnant Women Login
router.post('/login-pregnant-woman', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email, role: 'pregnant_woman' });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: 'pregnant_woman'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ msg: 'Login successful', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View medical records
router.get('/medical-records', auth, async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.user.id }).populate('doctor');
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View medication details
router.get('/medications', auth, async (req, res) => {
    try {
        const medications = await Medication.find({ patient: req.user.id }).populate('doctor');
        res.json(medications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add family/friend details
router.post('/family-friends', auth, async (req, res) => {
    try {
        const { name, relationship, phone, email } = req.body;

        const familyFriend = new FamilyFriend({
            patient: req.user.id,
            name,
            relationship,
            phone,
            email
        });

        await familyFriend.save();
        res.json({ msg: 'Family/Friend added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View family/friend details
router.get('/family-friends', auth, async (req, res) => {
    try {
        const familyFriends = await FamilyFriend.find({ patient: req.user.id });
        res.json(familyFriends);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
