const BaseRepository = require('./base.repository');
const Task = require('../data/models/task.model');

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task, 'task');
  }

  async findByUser(userId) {
    console.log('userId', userId);
    const cacheKey = `${this.cacheName}:user:${userId}`;
    const cached = await this.cacheService.get(cacheKey);

    if (Array.isArray(cached) && cached.length > 0) return cached;

    const tasks = await this.model.find({ userId });
    await this.cacheService.set(cacheKey, tasks);
    return tasks;
  }
}

module.exports = new TaskRepository(); 