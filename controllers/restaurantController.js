const multer = require('multer'); // Import multer for file uploads
const fs = require('fs'); // Import fs for file system operations
const path = require('path'); // Import path to handle file paths
const Restaurant = require('../models/restaurant');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where the uploaded file will be stored
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

// Image upload route (for getting the image URL)
const uploadImage = (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }

  // Return the image URL
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};

// Get All Restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching restaurants',
      error: error.message,
    });
  }
};

// Get Restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: 'Server error. Unable to fetch restaurant details.',
      error: error.message,
    });
  }
};

// Create Restaurant
const createRestaurant = async (req, res) => {
  const { name, location, cuisine, hours, description, price } = req.body;

  try {
    // Validate required fields
    if (!name || !location || !cuisine || !hours || !description || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingRestaurant = await Restaurant.findOne({ name });

    if (existingRestaurant) {
      return res.status(400).json({ message: `Restaurant "${name}" already exists.` });
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      cuisine,
      hours,
      description,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : null, // Only set image if file exists
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating restaurant',
      error: error.message,
    });
  }
};

// Update Restaurant Profile
const updateRestaurantProfile = async (req, res) => {
  const { id } = req.params;
  const { description, location, cuisine, hours, price, imageUrl } = req.body;

  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // If a new image URL is provided, update the restaurant image
    if (imageUrl) {
      // If a new image is uploaded, delete the old image and update the path
      if (restaurant.image) {
        const oldImagePath = path.join(__dirname, '..', restaurant.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Remove the old image
        }
      }

      restaurant.image = imageUrl; // Update to the new image URL
    }

    // Update other fields if provided
    if (description) restaurant.description = description;
    if (location) restaurant.location = location;
    if (cuisine) restaurant.cuisine = cuisine;
    if (hours) restaurant.hours = hours;
    if (price) restaurant.price = price;

    await restaurant.save();

    res.status(200).json({
      message: 'Restaurant profile updated successfully',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating restaurant profile',
      error: error.message,
    });
  }
};

// Export all functions for use in routes
module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurantProfile,
  upload,
  uploadImage,  // Export the image upload function
};
