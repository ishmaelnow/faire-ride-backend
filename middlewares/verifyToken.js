const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Middleware to verify token and optionally check for roles
const verifyToken = (requiredRole) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Attach the decoded token payload to the request
    req.user = decoded;

    // Fetch user details from the database
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from user data
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user details to the request for further use
    req.userDetails = user;

    // If a role is required, ensure the user's role matches
    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({ message: `Access denied: ${requiredRole} role required` });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message);

    // Handle token expiration or other JWT-related errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    res.status(500).json({ message: 'Server error during authentication' });
  }
};

module.exports = verifyToken;
