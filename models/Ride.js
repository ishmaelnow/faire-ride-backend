const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  pickupTime: { type: Date, required: true },
  driverName: { type: String, default: null },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }, // New field
});

module.exports = mongoose.model('Ride', RideSchema);
