const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Fetch Customer-Specific Data
router.get('/', verifyToken('user'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Fetch user data
    const recentRides = await Ride.find({ email: user.email })
      .sort({ pickupTime: -1 })
      .limit(5); // Fetch last 5 rides

    res.json({ user, recentRides });
  } catch (error) {
    console.error('Error fetching customer dashboard data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
