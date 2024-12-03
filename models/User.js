const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: 'user' }, // 'admin' or 'user'
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new/changed
  this.password = await bcrypt.hash(this.password, 10); // Hash password
  next();
});

module.exports = mongoose.model('User', UserSchema);
