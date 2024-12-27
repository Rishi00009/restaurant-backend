const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, restaurantId, items, totalPrice, deliveryTime } = req.body;

  try {
    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalPrice,
      deliveryTime,
    });

    await newOrder.save();

    // Create order in Razorpay
    const options = {
      amount: totalPrice * 100,  // Razorpay expects the amount in paise
      currency: 'INR',
      receipt: `order_${newOrder._id}`,
    };

    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json(err);
      }
      newOrder.razorpayOrderId = order.id;
      newOrder.save();
      res.status(201).json({ order, newOrder });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all orders (for admin or user)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Update order status (e.g., preparing, out for delivery, delivered)
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

const newRestaurant = new Restaurant({
  name: 'Pasta Paradise',
  location: '123 Pasta St, Italy',
  cuisine: 'Italian',
  hours: '9:00 AM - 9:00 PM',
  description: 'A cozy place for pasta lovers',
  image: 'http://example.com/images/restaurant.jpg',
});

newRestaurant.save()
  .then((result) => {
    console.log('Restaurant added successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting restaurant:', error);
  });