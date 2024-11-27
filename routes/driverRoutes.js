const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Fetch all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true });
    res.status(200).json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err.message);
    res.status(500).json({ error: 'Could not fetch drivers. Please try again later.' });
  }
});

// Add a new driver
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    const newDriver = new Driver({ name, phone, email });
    const savedDriver = await newDriver.save();

    res.status(201).json(savedDriver);
  } catch (err) {
    console.error('Error adding driver:', err.message);
    res.status(500).json({ error: 'Failed to add driver.' });
  }
});

// Update driver availability
router.put('/:id/availability', async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'Invalid availability value.' });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found.' });
    }

    res.status(200).json(driver);
  } catch (err) {
    console.error('Error updating driver availability:', err.message);
    res.status(500).json({ error: 'Failed to update driver availability.' });
  }
});

module.exports = router;
