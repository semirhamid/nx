const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { ApiError } = require('../middlewares/errorHandler');

class AuthService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
    });
    
    const token = this.generateToken(user._id);
    return { user, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user._id);
    const userResponse = user.toJSON();
    return { user: userResponse, token };
  }

  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new AuthService(); 