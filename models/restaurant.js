// models/Restaurant.js

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },  // Field for storing image URL
  description: { type: String }, // Field for storing restaurant description
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  hours: { type: String },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]  // Add menu field to reference MenuItem
});

module.exports = mongoose.model('Restaurant', restaurantSchema);


