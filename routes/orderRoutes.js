const express = require('express');
const { getOrderStatus, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.get('/:orderId/status', getOrderStatus);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
