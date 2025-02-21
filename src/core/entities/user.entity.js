class UserEntity {
  constructor(id, email, password, role, createdAt, updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = UserEntity; 