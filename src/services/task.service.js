const taskRepository = require('../repositories/task.repository');
const { ApiError } = require('../middlewares/errorHandler');

class TaskService {
  async getAllTasks(userId) {
    return taskRepository.findByUser(userId);
  }

  async createTask(data, userId) {
    return taskRepository.create({ ...data, userId });
  }

  async getTaskById(id, userId) {
    const task = await taskRepository.findById(id);
    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Not authorized to access this task');
    }
    return task;
  }

  async updateTask(id, data, userId) {
    await this.getTaskById(id, userId); // Check ownership
    return taskRepository.update(id, data);
  }

  async deleteTask(id, userId) {
    await this.getTaskById(id, userId); // Check ownership
    return taskRepository.delete(id);
  }
}

module.exports = new TaskService(); 