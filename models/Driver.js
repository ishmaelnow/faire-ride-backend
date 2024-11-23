const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Driver', DriverSchema);
