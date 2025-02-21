const BaseRepository = require('./base.repository');
const User = require('../data/models/user.model');
const { ApiError } = require('../middlewares/errorHandler');

class UserRepository extends BaseRepository {
  constructor() {
    super(User, 'user');
  }

  async findByEmail(email) {
    const cacheKey = `${this.cacheName}:email:${email}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) return cached;

    const user = await this.model.findOne({ email }).select('+password');
    if (user) {
      await this.cacheService.set(cacheKey, user);
    }
    return user;
  }

  async create(data) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }
    const user = new this.model(data);
    await user.save();

    await this.cacheService.del(`${this.cacheName}:all`);
    return user;
  }
}

module.exports = new UserRepository(); 