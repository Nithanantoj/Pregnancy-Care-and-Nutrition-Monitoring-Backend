const express = require('express');
const router = express.Router();
const doctorAuth = require('../middleware/doctorAuth');
const auth = require('../middleware/auth');
const PregnancyTest = require('../models/PregnancyTest');

// Add a new Test
router.post('/add-test', doctorAuth, async (req, res) => {
    try {
        const { testName, testDescription } = req.body;

        let pregnancyTest = new PregnancyTest({
            testName,
            testDescription,
            testResults: []
        });

        await pregnancyTest.save();
        res.status(201).json({ msg: 'New test added successfully', pregnancyTest });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add or Update Test Results
router.post('/update-test-results', doctorAuth, async (req, res) => {
        try {
            const { testId, userId, remarks, resultPdf } = req.body;
    
            // Find existing test by ID
            let pregnancyTest = await PregnancyTest.findById(testId);
    
            if (!pregnancyTest) {
                return res.status(400).json({ msg: 'Test not found. Please provide a valid test ID.' });
            }
    
            // Update existing test with new result
            const existingResultIndex = pregnancyTest.testResults.findIndex(result => result.user.toString() === userId);
    
            if (existingResultIndex !== -1) {
                // Update existing test result for the user
                pregnancyTest.testResults[existingResultIndex] = { user: userId, remarks, resultPdf };
            } else {
                // Add new test result for the user
                pregnancyTest.testResults.push({ user: userId, remarks, resultPdf });
            }
    
            await pregnancyTest.save();
            res.json({ msg: 'Test results updated successfully', pregnancyTest });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });


router.get('/view-test-results', auth, async (req, res) => {
    try {
        // Retrieve the userId from the authenticated user's object
        const userId = req.user.id;
        console.log(`${userId}`);
        // Find test results that match the specified user ID
        const testResults = await PregnancyTest.find({ 'testResults.user': userId });

        // If no test results are found for the user, return a 404 status with a relevant message
        if (!testResults || testResults.length === 0) {
            
            return res.status(404).json({ msg: 'Test results not found for this user' });
            
        }

        // Filter out unnecessary fields and only include testName, testDescription, and filtered testResults
        const filteredResults = testResults.map(test => ({
            testName: test.testName,
            testDescription: test.testDescription,
            testResults: test.testResults.filter(result => result.user.toString() === userId)
        }));

        // Send the filtered test results in the response
        res.json(filteredResults);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
module.exports = router;
