const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const User = require('../data/models/user.model');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized to access this route');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw new ApiError(401, 'User not found');
    }

    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized to access this route'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
}; 