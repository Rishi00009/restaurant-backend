const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

// Route for creating an order
router.post('/', createOrder);

// Route for getting all orders
router.get('/', getOrders);

// Route for updating order status (e.g., preparing, out for delivery, delivered)
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
