// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items for a specific restaurant
router.get('/:restaurantId', menuController.getMenuItems);

// Create a new menu item for a specific restaurant
router.post('/:restaurantId', menuController.createMenuItem);

module.exports = router;
