const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Ride = require('../models/Ride');
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

const router = express.Router();

// Secret for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// New admin registration route (Protected by authMiddleware)
router.post('/admin-register', authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role: 'admin' }); // Mark as 'admin'
    await newUser.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.error('Error registering admin:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Fetch all rides (Protected by authMiddleware)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err.message);
    res.status(500).json({ error: 'Could not fetch rides. Please try again later.' });
  }
});

// Fetch a single ride by ID (Protected by authMiddleware)
router.get('/:id', authMiddleware, async (req, res) => {
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

// Book a new ride (Unprotected - Guest booking allowed)
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

// Assign a driver to a ride (Admin only, Protected)
router.put('/:id/assign-driver', authMiddleware, async (req, res) => {
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
    res.status(500).json({ error: 'Failed to assign driver.' });
  }
});

// Update ride status (Admin only, Protected)
router.put('/:id/status', authMiddleware, async (req, res) => {
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
