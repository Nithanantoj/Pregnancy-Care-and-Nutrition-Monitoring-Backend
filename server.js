const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pregnantWomenRoutes = require('./routes/pregnantwomen');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const nutritionRoutes = require('./routes/nutrition');
const appointmentRoutes = require('./routes/appointment');
const profileRoutes = require('./routes/profile');
const medicalRecordsRoutes = require('./routes/medicalRecords');
const testResultRoutes = require('./routes/testResults');
const medicationRoutes = require('./routes/medication');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });


app.use('/api/pregnant-women', pregnantWomenRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/doctors', doctorRoutes); 
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/Profile', profileRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/medications', medicationRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
