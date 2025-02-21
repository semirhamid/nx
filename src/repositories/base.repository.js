const { ApiError } = require('../middlewares/errorHandler');
const cacheService = require('../services/cache.service');

class BaseRepository {
  constructor(model, cacheName) {
    this.model = model;
    this.cacheName = cacheName;
    this.cacheService = cacheService;
  }

  async findById(id) {
    const cacheKey = `${this.cacheName}:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) return cached;

    const item = await this.model.findById(id);
    if (!item) {
      throw new ApiError(404, 'Resource not found');
    }

    await this.cacheService.set(cacheKey, item);
    return item;
  }

  async findAll(filter = {}) {
    const cacheKey = `${this.cacheName}:all:${JSON.stringify(filter)}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) return cached;

    const items = await this.model.find(filter);
    await this.cacheService.set(cacheKey, items);
    return items;
  }

  async create(data) {
    const item = await this.model.create(data);
    await this.cacheService.del(`${this.cacheName}:all`);
    return item;
  }

  async update(id, data) {
    const item = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!item) {
      throw new ApiError(404, 'Resource not found');
    }

    await this.cacheService.del(`${this.cacheName}:${id}`);
    await this.cacheService.del(`${this.cacheName}:all`);
    return item;
  }

  async delete(id) {
    const item = await this.model.findByIdAndDelete(id);
    
    if (!item) {
      throw new ApiError(404, 'Resource not found');
    }

    await this.cacheService.del(`${this.cacheName}:${id}`);
    await this.cacheService.del(`${this.cacheName}:all`);
    return item;
  }
}

module.exports = BaseRepository; 