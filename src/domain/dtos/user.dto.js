class CreateUserDto {
  constructor(email, password, role = 'user') {
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

class UpdateUserDto {
  constructor(email, role) {
    this.email = email;
    this.role = role;
  }
}

class UserResponseDto {
  constructor(id, email, role, createdAt) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}

module.exports = {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
}; 