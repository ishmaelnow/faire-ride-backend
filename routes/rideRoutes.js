const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

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
        const driver = await Driver.findOne({ name: driverName });
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found.' });
        }
        const ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { driverName: driver.name },
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

// Fetch all drivers
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (err) {
        console.error('Error fetching drivers:', err.message);
        res.status(500).json({ error: 'Could not fetch drivers. Please try again later.' });
    }
});

// Add a new driver
router.post('/drivers', async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        if (!name || !phone || !email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newDriver = new Driver({ name, phone, email, isAvailable: true });
        await newDriver.save();
        res.status(201).json(newDriver);
    } catch (err) {
        console.error('Error adding driver:', err.message);
        res.status(500).json({ error: 'Failed to add driver. Please try again later.' });
    }
});

// Delete a driver
router.delete('/drivers/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found.' });
        }
        res.status(200).json({ message: 'Driver deleted successfully.' });
    } catch (err) {
        console.error('Error deleting driver:', err.message);
        res.status(500).json({ error: 'Failed to delete driver. Please try again later.' });
    }
});

module.exports = router;
