// models/restaurant.js

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  hours: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
