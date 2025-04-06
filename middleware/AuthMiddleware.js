const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    // Retrieve the token from the cookies using cookie-parser
    if (!req.cookies) {
        return res.status(400).json({ error: 'Cookies not found with the request body' });
    }

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user data to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;