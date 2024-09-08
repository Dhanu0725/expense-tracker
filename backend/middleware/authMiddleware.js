const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); // Use userId from token
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
