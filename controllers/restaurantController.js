// controllers/restaurantController.js

const Restaurant = require('../models/restaurant');

// Get All Restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};

// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
};

// Create Restaurant
exports.createRestaurant = async (req, res) => {
  const { name, location, cuisine, hours, description, image } = req.body;
  try {
    const existingRestaurant = await Restaurant.findOne({ name });

    if (existingRestaurant) {
      return res.status(400).json({ message: `Restaurant "${name}" already exists.` });
    }

    const newRestaurant = new Restaurant({ name, location, cuisine, hours, description, image });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error: error.message });
  }
};
