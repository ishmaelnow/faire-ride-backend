const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// GET: Fetch all rides (Admin only)
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error: error.message });
  }
});

// PUT: Assign a driver to a ride (Admin only)
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { driverName: req.body.driverName },
      { new: true }
    );
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: 'Error assigning driver', error: error.message });
  }
});

// PUT: Update ride status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: 'Error updating ride status', error: error.message });
  }
});

module.exports = router;
