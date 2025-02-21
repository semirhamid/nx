class CreateTaskDto {
  constructor(title, description, userId) {
    this.title = title;
    this.description = description;
    this.userId = userId;
  }
}

class UpdateTaskDto {
  constructor(title, description, status) {
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

class TaskResponseDto {
  constructor(id, title, description, status, userId, createdAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.userId = userId;
    this.createdAt = createdAt;
  }
}

module.exports = {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto
}; 