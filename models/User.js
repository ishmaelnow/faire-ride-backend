const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Role field
    name: { type: String, required: true }, // Added name for personalization
    profile: {
      phone: { type: String },
      address: { type: String },
    }, // Optional customer-specific details
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
