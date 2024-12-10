const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// Admin Dashboard Overview
router.get('/', verifyToken('admin'), (req, res) => {
  res.json({
    message: 'Welcome to the admin dashboard!',
    user: req.userDetails, // Authenticated admin's data
  });
});

// Fetch Admin-Specific Data
router.get('/summary', verifyToken('admin'), async (req, res) => {
  try {
    const data = {
      totalRides: 123, // Example logic
      totalDrivers: 45, // Example logic
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary data', error: error.message });
  }
});

module.exports = router;
