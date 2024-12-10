const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Booking model
const sendEmail = require('../services/sendEmail'); // MailerSend email service

// POST: Create a new ride booking
router.post('/', async (req, res) => {
  const { name, email, phone, pickupLocation, dropoffLocation, pickupTime, status } = req.body;

  try {
    // Validate input (excluding status)
    if (!name || !email || !phone || !pickupLocation || !dropoffLocation || !pickupTime) {
      return res.status(400).json({ message: 'All fields except status are required.' });
    }

    // Save the booking in the database
    const newBooking = new Booking({
      name,
      email,
      phone,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      status, // Allow any string for status
    });
    await newBooking.save();

    // Send confirmation email to the customer
    try {
      await sendEmail({
        to: email,
        subject: 'Your Ride Booking Confirmation',
        url: `http://localhost:3000/booking-details/${newBooking._id}`,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError.message);
    }

    // Notify the admin about the new booking
    try {
      await sendEmail({
        to: process.env.MAILERSEND_FROM_EMAIL,
        subject: 'New Ride Booking Notification',
        url: `http://localhost:3000/admin-dashboard/bookings`,
      });
    } catch (adminEmailError) {
      console.error('Error sending admin notification:', adminEmailError.message);
    }

    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET: Fetch all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }); // Fetch all bookings, newest first
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Server error. Unable to fetch bookings.' });
  }
});

// GET: Fetch a single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error.message);
    res.status(500).json({ message: 'Server error. Unable to fetch the booking.' });
  }
});

// PATCH: Update booking status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status }, // Allow any string for status
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({ message: 'Booking status updated successfully!', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error.message);
    res.status(500).json({ message: 'Server error. Unable to update booking status.' });
  }
});

// POST: Transform booking to a ride
router.post('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'transformed' },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({
      message: 'Booking successfully transformed into a ride.',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error transforming booking to ride:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// PUT: Update a booking by ID
router.put('/:id', async (req, res) => {
  const { name, email, phone, pickupLocation, dropoffLocation, pickupTime, status } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, pickupLocation, dropoffLocation, pickupTime, status },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({ message: 'Booking updated successfully!', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error.message);
    res.status(500).json({ message: 'Server error. Unable to update the booking.' });
  }
});

// DELETE: Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking deleted successfully!' });
  } catch (error) {
    console.error('Error deleting booking:', error.message);
    res.status(500).json({ message: 'Server error. Unable to delete the booking.' });
  }
});

module.exports = router;
