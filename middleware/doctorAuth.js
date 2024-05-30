const jwt = require('jsonwebtoken');

// Middleware to authenticate doctor users
const doctorAuth = (req, res, next) => {
    // Check if the request contains a JWT token in the headers
    const token = req.header('x-auth-token');

    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains the doctor ID and role
        if (decoded.doctor && decoded.doctor.role === 'doctor') {
            // If authenticated, set the user object in the request and call the next middleware
            req.doctor = decoded.doctor;
            next();
        } else {
            // If the token does not belong to a doctor user, return an error
            return res.status(401).json({ msg: 'Token is not valid for doctor authentication' });
        }
    } catch (err) {
        // If there's an error verifying the token, return an error
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = doctorAuth;
