const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pregnantWomenRoutes = require('./routes/pregnantwomen');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor')

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

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/api/pregnant-women', pregnantWomenRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/doctors', doctorRoutes); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
