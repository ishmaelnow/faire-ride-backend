const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// Middleware for basic admin authentication
const authenticateAdmin = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword === 'admin123') {
    next(); // Allow access
  } else {
    res.status(403).json({ error: 'Unauthorized access' });
  }
};

// Fetch all rides (Admin only)
router.get('/rides', authenticateAdmin, async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err.message);
    res.status(500).json({ error: 'Could not fetch rides. Please try again later.' });
  }
});

// Assign a driver to a ride (Admin only)
router.put('/rides/:id/assign-driver', authenticateAdmin, async (req, res) => {
  try {
    const { driverName } = req.body;

    // Validate driver details
    if (!driverName) {
      return res.status(400).json({ error: 'Driver name is required.' });
    }

    // Check if the driver exists
    const driver = await Driver.findOne({ name: driverName });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found.' });
    }

    // Assign the driver to the ride
    const ride = await Ride.findByIdAndUpdate(req.params.id, { driverName: driver.name }, { new: true });
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    res.status(200).json({ ride, driver });
  } catch (err) {
    console.error('Error assigning driver:', err.message);
    res.status(500).json({ error: 'Failed to assign driver.' });
  }
});

module.exports = router;
