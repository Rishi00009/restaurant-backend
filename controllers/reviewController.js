const Review = require('../models/review');
const MenuItem = require('../models/menuItem');

// Add a review for a menu item
const createReview = async (req, res) => {
  const { comment, rating } = req.body;
  const menuItemId = req.params.menuItemId;

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const review = new Review({ menuItemId, comment, rating });
    await review.save();

    menuItem.reviews.push(review._id);
    await menuItem.save();

    res.status(200).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews for a menu item
const getReviews = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.menuItemId).populate('reviews');
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem.reviews);  // Return reviews directly from the populated menu item
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReview, getReviews };
