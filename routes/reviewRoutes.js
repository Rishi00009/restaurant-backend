const express = require('express');
const router = express.Router();
const { createReview, getReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for creating a review (with auth middleware)
router.post('/:menuItemId', authMiddleware, createReview);

// Route for fetching reviews for a specific menu item
router.get('/:menuItemId', getReviews);

module.exports = router;
