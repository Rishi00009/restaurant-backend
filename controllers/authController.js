// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Auto-generate a unique username based on email
    let username = email.split('@')[0];
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      username = `${username}_${Date.now()}`;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      username,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, email);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error. Unable to register user.', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id, email);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    // Fetch user details without the password field
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error. Unable to fetch user details.', error: error.message });
  }
};

// Update User Details
exports.updateUserDetails = async (req, res) => {
  const { name, email, profilePicture, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.userId);  // Use req.userId instead of req.user.userId
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user details
    if (name) user.name = name;
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email is already in use by another account.' });
      }
      user.email = email;
    }
    if (profilePicture) user.profilePicture = profilePicture;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error. Unable to update user details.', error: error.message });
  }
};
