require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Stripe = require('stripe');
const app = express();

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }, // Allow cross-origin requests
});

// Middleware
app.use(cors({
  origin: 'https://restaurant-rishi.netlify.app', // Your Netlify frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('A user connected.');

  // Join a specific order room
  socket.on('joinOrderRoom', (orderId) => {
    console.log(`User joined order room: ${orderId}`);
    socket.join(orderId);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

// Helper function to broadcast order status updates
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const Order = require('./models/order'); // Dynamically load the Order model
    const order = await Order.findById(orderId);
    if (order) {
      order.status = newStatus;
      await order.save();
      io.to(orderId).emit('orderStatusUpdated', newStatus);
    }
  } catch (err) {
    console.error('Error updating order status:', err);
  }
};

// Stripe Integration Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: Stripe secret key is not set in the environment variables.');
  process.exit(1); // Exit the process to prevent further errors
}

// Routes
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.set('io', io); // Add this line

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Mongoose Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
