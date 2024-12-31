const express = require('express');
const { createPaymentIntent, getPaymentHistory } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes

const router = express.Router();

router.post('/intent', authMiddleware, createPaymentIntent);
router.get('/history', authMiddleware, getPaymentHistory);

module.exports = router;
