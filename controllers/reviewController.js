const Review = require('../models/review');

// Create a new review
exports.createReview = async (req, res) => {
  const { restaurantId, userId, rating, comment } = req.body;

  try {
    const newReview = new Review({
      restaurantId,
      userId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

// Get all reviews for a specific restaurant
exports.getReviews = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const reviews = await Review.find({ restaurantId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
};
