const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Fetch all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err.message);
    res.status(500).json({ error: 'Could not fetch rides. Please try again later.' });
  }
});

// Fetch a single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }
    res.status(200).json(ride);
  } catch (err) {
    console.error('Error fetching ride details:', err.message);
    res.status(500).json({ error: 'Could not fetch ride details. Please try again later.' });
  }
});

// Book a new ride
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, pickupLocation, dropoffLocation, pickupTime } = req.body;

    if (!customerName || !phone || !email || !pickupLocation || !dropoffLocation || !pickupTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newRide = new Ride({ customerName, phone, email, pickupLocation, dropoffLocation, pickupTime });
    await newRide.save();

    res.status(201).json(newRide);
  } catch (err) {
    console.error('Error booking ride:', err.message);
    res.status(500).json({ error: 'Failed to book ride. Please try again later.' });
  }
});

// Assign a driver to a ride
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverName } = req.body;

    if (!driverName) {
      return res.status(400).json({ error: 'Driver name is required.' });
    }

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { driverName },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    res.status(200).json(ride);
  } catch (err) {
    console.error('Error assigning driver:', err.message);
    res.status(500).json({ error: 'Failed to assign driver. Please try again later.' });
  }
});

// Update ride status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    res.status(200).json(ride);
  } catch (err) {
    console.error('Error updating ride status:', err.message);
    res.status(500).json({ error: 'Failed to update ride status.' });
  }
});

module.exports = router;
