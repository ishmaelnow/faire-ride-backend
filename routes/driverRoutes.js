const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

// Create a new driver
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const newDriver = new Driver({ name, email, phone });
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ message: 'Error creating driver', error: error.message });
  }
});

// Update driver availability
router.put('/:id/availability', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ message: 'Error updating availability', error: error.message });
  }
});

module.exports = router;
