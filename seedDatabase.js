const mongoose = require('mongoose');
const MenuItem = require('./models/menuItem'); // Correct the path if necessary

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://myUsername:myPassword@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

async function insertMenuItems() {
  const menuItems = [
    {
      name: "Spaghetti Bolognese",
      description: "Delicious pasta with rich tomato sauce and ground beef.",
      price: 12.99,
      image: "http://example.com/images/spaghetti.jpg",
      restaurantId: new mongoose.Types.ObjectId("676f8b110a445b665a943023") // Corrected: Use `new`
    },
    {
      name: "Pasta Carbonara",
      description: "A classic Italian pasta dish",
      price: 12.99,
      image: "http://example.com/images/pasta_carbonara.jpg",
      restaurantId: new mongoose.Types.ObjectId("676f8b110a445b665a943023") // Corrected: Use `new`
    },
    {
      name: "Ravioli Delight",
      description: "Homemade ravioli stuffed with ricotta cheese and spinach.",
      price: 12.99,
      image: "http://example.com/images/ravioli.jpg",
      restaurantId: new mongoose.Types.ObjectId("676f8b110a445b665a943023") // Corrected: Use `new`
    },
    {
      name: "Tiramisu Temptation",
      description: "Traditional Italian dessert with layers of coffee-soaked ladyfingers.",
      price: 6.99,
      image: "http://example.com/images/tiramisu.jpg",
      restaurantId: new mongoose.Types.ObjectId("676f8b110a445b665a943023") // Corrected: Use `new`
    }
  ];

  try {
    await MenuItem.insertMany(menuItems);
    console.log('Menu items inserted successfully');
  } catch (error) {
    console.error('Error inserting menu items:', error);
  }
}

insertMenuItems();
