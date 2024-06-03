const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../Models/User');
const FoodRoutine = require('../Models/FoodRoutine');
const FamilyFriend = require('../Models/FamilyFriend');

// Update user food routine
router.put('/food-routine/', auth, async (req, res) => {
    try {
        const { vegetarian, breakfastTime, lunchTime, dinnerTime } = req.body;

        // Update or create food routine
        let foodRoutine = await FoodRoutine.findOne({ user: req.user.id });

        if (!foodRoutine) {
            foodRoutine = new FoodRoutine({
                user: req.user.id,
                vegetarian,
                breakfastTime,
                lunchTime,
                dinnerTime
            });
        } else {
            foodRoutine.vegetarian = vegetarian;
            foodRoutine.breakfastTime = breakfastTime;
            foodRoutine.lunchTime = lunchTime;
            foodRoutine.dinnerTime = dinnerTime;
        }

        await foodRoutine.save();

        res.json({ msg: 'food routine updated successfully', foodRoutine });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add family/friend details
router.post('/familyfriend', auth, async (req, res) => {
    try {
        const { name, relationship, phone, whatsapp, email } = req.body;

        const familyFriend = new FamilyFriend({
            patient: req.user.id,
            name,
            relationship,
            phone,
            whatsapp,
            email
        });

        await familyFriend.save();
        res.json({ msg: 'Family/Friend added successfully', familyFriend });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete family/friend details
router.delete('/familyfriend/:id', auth, async (req, res) => {
    try {
        const familyFriend = await FamilyFriend.findById(req.params.id);

        if (!familyFriend) {
            return res.status(404).json({ msg: 'Family/Friend not found' });
        }

        if (familyFriend.patient.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this family/friend' });
        }

        await familyFriend.deleteOne();
        res.json({ msg: 'Family/Friend deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// View user profile, food routine, and family/friends details
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const foodRoutine = await FoodRoutine.findOne({ user: req.user.id });
        const familyFriends = await FamilyFriend.find({ patient: req.user.id });

        if (!user || !foodRoutine || !familyFriends) {
            return res.status(404).json({ msg: 'User profile, food routine, or family/friends details not found' });
        }

        const userProfile = {
            user: {
                name: user.name,
                phone: user.phone_no,
                email: user.email,
                whatsapp_no: user.whatsapp_no,
            },
            foodRoutine,
            familyFriends
        };

        res.json(userProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router;