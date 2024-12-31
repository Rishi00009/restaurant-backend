const mongoose = require('mongoose');
const MenuItem = require('../models/menuItem');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');

// Utility function for validating MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    if (!restaurantId || !isValidObjectId(restaurantId.trim())) {
      return res.status(400).json({ message: 'Invalid or missing restaurant ID.' });
    }

    const menuItems = await MenuItem.find({ restaurantId: restaurantId.trim() }).populate('restaurantId');
    if (!menuItems.length) {
      return res.status(404).json({ message: 'No menu items found for this restaurant.' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Create a new menu item for a restaurant
exports.createMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, price, image, ingredients, calories, category, tags } = req.body;

  try {
    if (!restaurantId || !isValidObjectId(restaurantId)) {
      console.error('Invalid restaurantId:', restaurantId);
      return res.status(400).json({ message: 'Invalid or missing restaurant ID.' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.error('Restaurant not found:', restaurantId);
      return res.status(404).json({ message: 'Restaurant not found.' });
    }

    const user = await User.findById(req.user.userId); // Assuming authMiddleware adds user ID
    if (user.role !== 'restaurantOwner' || user.restaurantName !== restaurant.name) {
      console.error('User is not the restaurant owner:', user.role, user.restaurantName);
      return res.status(403).json({ message: 'You are not authorized to add menu items for this restaurant.' });
    }

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

    console.log('Creating new menu item:', newMenuItem);

    await newMenuItem.save();

    restaurant.menu.push(newMenuItem._id);
    await restaurant.save();

    console.log('Menu item created successfully:', newMenuItem);
    res.status(201).json({ message: 'Menu item created successfully.', menuItem: newMenuItem });
  } catch (error) {
    console.error('Error creating menu item:', error.message);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};


// Add a review for a menu item
exports.addReview = async (req, res) => {
  const { menuItemId } = req.params;
  const { rating, comment } = req.body;

  try {
    if (!menuItemId || !isValidObjectId(menuItemId)) {
      return res.status(400).json({ message: 'Invalid or missing menu item ID.' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    const review = new Review({
      menuItemId,
      userId: req.user.userId, // Assuming user ID is passed via middleware
      rating,
      comment,
      date: new Date(),
    });

    await review.save();

    menuItem.reviews.push(review._id);
    await menuItem.save();

    res.status(200).json({ message: 'Review added successfully.', review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Get all reviews for a menu item
exports.getReviews = async (req, res) => {
  const { menuItemId } = req.params;

  try {
    if (!menuItemId || !isValidObjectId(menuItemId)) {
      return res.status(400).json({ message: 'Invalid or missing menu item ID.' });
    }

    const reviews = await Review.find({ menuItemId }).populate('userId', 'name email');
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this menu item.' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Update an existing menu item
exports.updateMenuItem = async (req, res) => {
  const { menuItemId } = req.params;
  const { name, description, price, image, ingredients, calories, category, tags } = req.body;

  try {
    if (!menuItemId || !isValidObjectId(menuItemId)) {
      return res.status(400).json({ message: 'Invalid or missing menu item ID.' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    const user = await User.findById(req.user.userId); // Assuming user is added by authMiddleware
    if (user.role !== 'restaurantOwner' || user.restaurantName !== restaurant.name) {
      return res.status(403).json({ message: 'You are not authorized to update this menu item.' });
    }

    Object.assign(menuItem, {
      name: name || menuItem.name,
      description: description || menuItem.description,
      price: price || menuItem.price,
      image: image || menuItem.image,
      ingredients: ingredients || menuItem.ingredients,
      calories: calories || menuItem.calories,
      category: category || menuItem.category,
      tags: tags || menuItem.tags,
    });

    await menuItem.save();

    res.status(200).json({ message: 'Menu item updated successfully.', menuItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};
