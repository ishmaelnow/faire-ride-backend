const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For potential future token-based functionality
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const router = express.Router();

// Load the ADMIN_SECRET from environment variables or use a hardcoded fallback for testing
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'hardcoded_fallback_secret';

// Debug log to verify the secret key is loaded
console.log('Loaded ADMIN_SECRET:', ADMIN_SECRET);

// Register an Admin (Protected by secretKey validation)
router.post('/register', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    // Validate input
    if (!email || !password || !secretKey) {
      return res.status(400).json({ error: 'Email, password, and secret key are required.' });
    }

    // Validate the secretKey
    if (secretKey !== ADMIN_SECRET) {
      console.log('Invalid secretKey:', secretKey); // Debug log
      return res.status(403).json({ error: 'Invalid secret key. Registration denied.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Create a new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: 'admin' }); // Assign 'admin' role
    await user.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.error('Error registering admin:', error.message);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Middleware to protect routes (e.g., login and access)
router.use(authMiddleware); // Apply middleware globally if desired

// Example of protected route
router.get('/protected-route', (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route.', user: req.user });
});

module.exports = router;
