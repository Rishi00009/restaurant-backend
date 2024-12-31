const Order = require('../models/order'); // Assuming you have an Order model

// Get order status
const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order status' });
  }
};

// Update order status (via WebSocket)
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit status update to WebSocket room
    const io = req.app.get('io');
    io.to(orderId).emit('orderStatusUpdated', status);

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = {
  getOrderStatus,
  updateOrderStatus,
};
