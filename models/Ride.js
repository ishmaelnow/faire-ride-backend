const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  pickupTime: { type: Date, required: true },
  dropoffLocation: { type: String, required: true },
  dropoffTime: { type: Date, required: true },
  driverName: { type: String, default: null },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Ride', rideSchema);
