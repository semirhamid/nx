const userRepository = require('../repositories/user.repository');
const { ApiError } = require('../middlewares/errorHandler');

class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async updateUser(id, data) {
    return userRepository.update(id, data);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }

  async assignRole(userId, role) {
    if (!['user', 'admin', 'manager'].includes(role)) {
      throw new ApiError(400, 'Invalid role');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return userRepository.update(userId, { role });
  }
}

module.exports = new UserService(); 