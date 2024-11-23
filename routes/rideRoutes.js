const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const sendEmail = require('../utils/sendEmail');

// Fetch all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find(); // Fetch all rides from the database
    res.status(200).json(rides); // Send the rides as a JSON response
  } catch (err) {
    console.error('Error fetching rides:', err.message);
    res.status(500).json({ error: 'Could not fetch rides. Please try again later.' });
  }
});

// Book a ride and send confirmation email
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, pickupLocation, dropoffLocation, pickupTime } = req.body;

    // Validate request payload
    if (!customerName || !phone || !email || !pickupLocation || !dropoffLocation || !pickupTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create a new ride and save it to the database
    const newRide = new Ride({ customerName, phone, email, pickupLocation, dropoffLocation, pickupTime });
    await newRide.save();

    // Email content
    const emailText = `
      Hi ${customerName},
      Thank you for booking with Fare Ride!
      Pickup: ${pickupLocation}
      Dropoff: ${dropoffLocation}
      Time: ${new Date(pickupTime).toLocaleString()}
    `;

    // Send confirmation email
    await sendEmail({ to: email, subject: 'Ride Confirmation', text: emailText });

    res.status(201).json(newRide); // Return the newly created ride
  } catch (err) {
    console.error('Error booking ride:', err.message);
    res.status(500).json({ error: 'Failed to book ride. Please try again later.' });
  }
});

// Assign a driver to a ride
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverName, driverPhone, driverEmail } = req.body;

    // Validate driver details
    if (!driverName || !driverPhone || !driverEmail) {
      return res.status(400).json({ error: 'Driver details are required.' });
    }

    // Check if the driver exists; if not, create a new driver
    let driver = await Driver.findOne({ name: driverName });
    if (!driver) {
      driver = new Driver({ name: driverName, phone: driverPhone, email: driverEmail, isAvailable: true });
      await driver.save();
    }

    // Assign the driver to the ride
    const ride = await Ride.findByIdAndUpdate(req.params.id, { driverName: driver.name }, { new: true });
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    res.status(200).json({ ride, driver }); // Return the updated ride and driver info
  } catch (err) {
    console.error('Error assigning driver:', err.message);
    res.status(500).json({ error: 'Failed to assign driver.' });
  }
});

module.exports = router;
