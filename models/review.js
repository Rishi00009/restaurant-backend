const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
