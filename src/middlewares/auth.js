const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const User = require('../data/models/user.model');

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user.hasPermission(permission)) {
        throw new ApiError(403, 'Insufficient permissions');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new ApiError(401, 'User not found');
      }

      next();
    } catch (error) {
      throw new ApiError(401, 'Not authorized to access this route');
    }
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role ${req.user.role} is not authorized`));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
  checkPermission
}; 