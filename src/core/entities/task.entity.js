class TaskEntity {
  constructor(id, title, description, status, userId, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = TaskEntity; 