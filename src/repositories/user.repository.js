const BaseRepository = require('./base.repository');
const User = require('../models/user.model');
const { ApiError } = require('../middlewares/errorHandler');
const cacheService = require('../services/cache.service');

class UserRepository extends BaseRepository {
  constructor() {
    super(User, 'user');
  }

  async findByEmail(email) {
    const cacheKey = `${this.cacheName}:email:${email}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) return cached;

    const user = await this.model.findOne({ email });
    if (user) {
      await cacheService.set(cacheKey, user);
    }
    return user;
  }

  async create(data) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }
    return super.create(data);
  }
}

module.exports = new UserRepository(); 