const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// GET: View pending bookings
router.get('/bookings/pending', verifyToken('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching pending bookings:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST: Approve and convert booking to ride
router.post('/bookings/:id/approve', verifyToken('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is already processed' });
    }

    const newRide = new Ride({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      pickupTime: booking.pickupTime,
    });

    await newRide.save();
    booking.status = 'approved';
    await booking.save();

    res.status(201).json({ message: 'Booking approved and ride created successfully', ride: newRide });
  } catch (error) {
    console.error('Error approving booking:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
