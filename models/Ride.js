const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  customerName: { type: String, required: true }, // Customer's name
  phone: { type: String, required: true }, // Customer's phone number
  email: { type: String, required: true }, // Customer's email address
  pickupLocation: { type: String, required: true }, // Ride pickup location
  dropoffLocation: { type: String, required: true }, // Ride dropoff location
  pickupTime: { type: Date, required: true }, // Scheduled pickup time
  driverName: { type: String, default: null }, // Assigned driver's name (optional)
});

module.exports = mongoose.model('Ride', RideSchema);


