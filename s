const express = require('express');
const Ride = require('../models/Ride');
const router = express.Router();

// Get all rides
router.get('/', async (req, res) => {
  const rides = await Ride.find();
  res.json(rides);
});

// Book a ride
router.post('/', async (req, res) => {
  const { customerName, phone, pickupLocation, dropoffLocation, pickupTime } = req.body;
  const newRide = new Ride({ customerName, phone, pickupLocation, dropoffLocation, pickupTime });
  await newRide.save();
  res.json(newRide);
});

// Assign a driver
router.put('/:id/assign', async (req, res) => {
  const { driver } = req.body;
  const updatedRide = await Ride.findByIdAndUpdate(req.params.id, { driver }, { new: true });
  res.json(updatedRide);
});

module.exports = router;
