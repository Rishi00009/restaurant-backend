// middleware/validateObjectId.js
const mongoose = require('mongoose');

const validateObjectId = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ message: `Invalid ${param} ID: ${req.params[param]}` });
  }
  next();
};

module.exports = validateObjectId;
