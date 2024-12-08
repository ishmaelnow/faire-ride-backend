const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  pickupTime: { type: Date, required: true },
  driverName: { type: String }, // Optional, can be assigned later
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }, // Ride status
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
