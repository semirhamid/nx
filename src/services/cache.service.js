const Redis = require('ioredis');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URI);
    this.ttl = parseInt(process.env.REDIS_TTL) || 3600;

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = this.ttl) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis set error:', error);
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Redis delete error:', error);
    }
  }

  async flush() {
    try {
      await this.redis.flushall();
    } catch (error) {
      logger.error('Redis flush error:', error);
    }
  }
}

module.exports = new CacheService(); 