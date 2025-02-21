const BaseRepository = require('./base.repository');
const Task = require('../models/task.model');

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task, 'task');
  }

  async findByUser(userId) {
    const cacheKey = `${this.cacheName}:user:${userId}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) return cached;

    const tasks = await this.model.find({ userId });
    await this.cacheService.set(cacheKey, tasks);
    return tasks;
  }
}

module.exports = new TaskRepository(); 