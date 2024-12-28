// middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // The role is in the decoded JWT
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;
  