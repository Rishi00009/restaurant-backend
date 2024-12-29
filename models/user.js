// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // Fix for the duplicate key error
  profilePicture: { type: String },
  role: { type: String, enum: ['customer', 'restaurantOwner'], default: 'customer' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: false }, // Add restaurantId field
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
