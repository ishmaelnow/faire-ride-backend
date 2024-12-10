const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// POST: Approve and convert booking to ride
router.post('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking is already approved or rejected
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking is already processed' });
    }

    // Create a new ride using booking details
    const newRide = new Ride({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      pickupTime: booking.pickupTime,
    });

    await newRide.save();

    // Update booking status to 'approved'
    booking.status = 'approved';
    await booking.save();

    res.status(201).json({ message: 'Booking approved and ride created successfully', ride: newRide });
  } catch (error) {
    console.error('Error approving booking:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
