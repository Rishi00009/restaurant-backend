const MenuItem = require('../models/menuItem');
const Restaurant = require('../models/restaurant');

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
  const { name, description, price, image } = req.body;
  const restaurantId = req.params.restaurantId;
  
  try {
    // Find the restaurant using restaurantId
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if the current user is the owner of the restaurant
    const user = await User.findById(req.user.userId); // Assume user is added by authMiddleware
    if (user.role !== 'restaurantOwner' || user.restaurantName !== restaurant.name) {
      return res.status(403).json({ message: 'You are not the owner of this restaurant' });
    }

    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      image,
      restaurantId,
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};