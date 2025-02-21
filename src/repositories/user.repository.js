const BaseRepository = require('./base.repository');
const User = require('../data/models/user.model');
const { ApiError } = require('../middlewares/errorHandler');
const cacheService = require('../services/cache.service');

class UserRepository extends BaseRepository {
  constructor() {
    super(User, 'user');
  }

  async findByEmail(email) {
    const cacheKey = `${this.cacheName}:email:${email}`;
    const user = await this.model.findOne({ email }).select('+password');
    return user;
  }

  async create(data) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }
    const user = new this.model(data);
    await user.save();

    await cacheService.del(`${this.cacheName}:all`);
    return user;
  }
}

module.exports = new UserRepository(); 