const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error: error.message });
  }
});

// Create a new ride
router.post('/', async (req, res) => {
  const { name, phone, email, pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.body;

  try {
    const newRide = new Ride({
      name,
      phone,
      email,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime
    });
    await newRide.save();
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
});

// Assign a driver to a ride
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

// Update ride status
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
