const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all menu items for a specific restaurant
router.get('/:restaurantId', menuController.getMenuItems);

// Create a new menu item for a specific restaurant
router.post('/:restaurantId', authMiddleware, menuController.createMenuItem);

// Add a review for a menu item
router.post('/review/:menuItemId', authMiddleware, menuController.addReview);

// Get all reviews for a specific menu item
router.get('/reviews/:menuItemId', menuController.getReviews);

// Update an existing menu item
router.put('/update/:menuItemId', authMiddleware, menuController.updateMenuItem);

module.exports = router;
