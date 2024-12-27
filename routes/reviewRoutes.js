const express = require('express');
const router = express.Router();
const { createReview, getReviews, updateReview } = require('../controllers/reviewController');

// Route for creating a new review
router.post('/', createReview);

// Route for getting all reviews for a specific restaurant
router.get('/:restaurantId', getReviews);

// Route for updating an existing review
router.put('/:reviewId', updateReview);

module.exports = router;
