const mongoose = require('mongoose');
const MenuItem = require('../models/menuItem');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review'); // Import Review model

// Get all menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
  let { restaurantId } = req.params;

  try {
    // Trim any extra whitespace or newline characters from restaurantId
    restaurantId = restaurantId.trim();

    // Check if restaurantId is valid
    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID is required.' });
    }

    // Find all menu items for the given restaurantId
    const menuItems = await MenuItem.find({ restaurantId }).populate('restaurantId');
    if (!menuItems.length) {
      return res.status(404).json({ message: 'No menu items found for this restaurant.' });
    }
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Create a new menu item for a restaurant
exports.createMenuItem = async (req, res) => {
  const { name, description, price, image, ingredients, calories, category, tags } = req.body;
  const restaurantId = req.params.restaurantId;

  try {
    // Validate restaurantId
    if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid or missing restaurant ID.' });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the current user is the owner of the restaurant
    const user = await User.findById(req.user.userId); // Assuming user is added by authMiddleware
    if (user.role !== 'restaurantOwner' || user.restaurantName !== restaurant.name) {
      return res.status(403).json({ message: 'You are not the owner of this restaurant' });
    }

    // Create a new menu item
    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      image,
      restaurantId,
      ingredients,
      calories,
      category,
      tags
    });

    // Save the menu item
    await newMenuItem.save();

    // Update the restaurant's menu field to include the new menu item
    restaurant.menu.push(newMenuItem._id);
    await restaurant.save();

    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// Add a review for a menu item
exports.addReview = async (req, res) => {
  const { menuItemId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Validate menuItemId
    if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: 'Invalid or missing menu item ID.' });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Create a new review
    const review = new Review({
      menuItemId,
      userId: req.user.userId, // Assuming user ID is passed via middleware
      rating,
      comment,
      date: new Date(),
    });

    // Save the review
    await review.save();

    // Add the review to the menu item's reviews array
    menuItem.reviews.push(review._id);
    await menuItem.save();

    res.status(200).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Get all reviews for a menu item
exports.getReviews = async (req, res) => {
  const { menuItemId } = req.params;

  try {
    // Validate menuItemId
    if (!menuItemId || !mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: 'Invalid or missing menu item ID.' });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Fetch all reviews for the menu item and populate user details
    const reviews = await Review.find({ menuItemId }).populate('userId', 'name email');

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
