// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant } = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get All Restaurants
router.get('/', getRestaurants);

// Get Restaurant by ID
router.get('/:id', getRestaurantById);

// Create Restaurant (only accessible by restaurant owners)
router.post('/', authMiddleware, roleMiddleware(['restaurantOwner']), createRestaurant);

module.exports = router;
