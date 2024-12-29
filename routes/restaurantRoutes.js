const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurantProfile,
  upload,
  uploadImage,  // New image upload route
} = require('../controllers/restaurantController');

// Routes
router.get('/', getRestaurants); // Get all restaurants
router.get('/:id', getRestaurantById); // Get a restaurant by ID
router.post('/', upload.single('image'), createRestaurant); // Create a new restaurant with an image
router.put('/:id', updateRestaurantProfile); // Update an existing restaurant profile (image URL is passed instead)
router.post('/uploadImage', upload.single('image'), uploadImage); // New route for uploading an image and returning the URL

module.exports = router;
